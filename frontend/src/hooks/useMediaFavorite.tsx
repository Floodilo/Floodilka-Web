/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {autorun} from 'mobx';
import {useCallback, useSyncExternalStore} from 'react';
import * as FavoriteMemeActionCreators from '~/actions/FavoriteMemeActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {AddFavoriteMemeModal} from '~/components/modals/AddFavoriteMemeModal';
import FavoriteMemeStore from '~/stores/FavoriteMemeStore';
import * as FavoriteMemeUtils from '~/utils/FavoriteMemeUtils';

interface UseMediaFavoriteParams {
	channelId?: string;
	messageId?: string;
	attachmentId?: string;
	embedIndex?: number;
	defaultName?: string;
	defaultAltText?: string;
	contentHash?: string | null;
	isGifv?: boolean;
	klipyId?: string | null;
}

interface UseMediaFavoriteReturn {
	isFavorited: boolean;
	toggleFavorite: (e: React.MouseEvent) => Promise<void>;
	canFavorite: boolean;
}

export function useMediaFavorite({
	channelId,
	messageId,
	attachmentId,
	embedIndex,
	defaultName,
	defaultAltText,
	contentHash,
	klipyId,
}: UseMediaFavoriteParams): UseMediaFavoriteReturn {
	const {i18n} = useLingui();

	const memes = useSyncExternalStore(
		(listener) => {
			const dispose = autorun(listener);
			return () => dispose();
		},
		() => FavoriteMemeStore.memes,
	);

	const isFavorited = FavoriteMemeUtils.isFavorited(memes, {contentHash, klipyId});

	const canFavorite = !!(channelId && messageId && (attachmentId || embedIndex !== undefined));

	const toggleFavorite = useCallback(
		async (e: React.MouseEvent) => {
			e.stopPropagation();

			if (!canFavorite) return;

			if (isFavorited) {
				const meme = FavoriteMemeUtils.findFavoritedMeme(memes, {contentHash, klipyId});
				if (!meme) return;
				await FavoriteMemeActionCreators.deleteFavoriteMeme(i18n, meme.id);
			} else {
				ModalActionCreators.push(
					modal(() => (
						<AddFavoriteMemeModal
							channelId={channelId!}
							messageId={messageId!}
							attachmentId={attachmentId}
							embedIndex={embedIndex}
							defaultName={defaultName}
							defaultAltText={defaultAltText}
						/>
					)),
				);
			}
		},
		[
			canFavorite,
			isFavorited,
			contentHash,
			klipyId,
			memes,
			channelId,
			messageId,
			attachmentId,
			embedIndex,
			defaultName,
			defaultAltText,
			i18n,
		],
	);

	return {
		isFavorited,
		toggleFavorite,
		canFavorite,
	};
}
