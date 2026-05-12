/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import type {KlipyGif} from '~/actions/KlipyActionCreators';
import {ComponentDispatch} from '~/lib/ComponentDispatch';
import type {FavoriteMemeRecord} from '~/records/FavoriteMemeRecord';
import type {GuildStickerRecord} from '~/records/GuildStickerRecord';
import UserStore from '~/stores/UserStore';
import type {MentionSegment} from '~/utils/TextareaSegmentManager';

function buildMemeUrl(klipyId: string): string {
	return `https://klipy.com/gif/${klipyId}`;
}

interface UseTextareaExpressionHandlersOptions {
	setValue: React.Dispatch<React.SetStateAction<string>>;
	textareaRef: React.RefObject<HTMLTextAreaElement | null>;
	insertSegment: (
		text: string,
		position: number,
		displayText: string,
		actualText: string,
		type: MentionSegment['type'],
		id: string,
	) => {newText: string; newSegments: Array<MentionSegment>};
	previousValueRef: React.MutableRefObject<string>;
	sendOptimisticMessage: (
		messageData: {content: string; stickers?: Array<any>; attachments?: Array<any>},
		sendOptions: {hasAttachments: boolean; favoriteMemeId?: string},
	) => void;
}

export const useTextareaExpressionHandlers = ({
	setValue,
	textareaRef,
	insertSegment,
	previousValueRef,
	sendOptimisticMessage,
}: UseTextareaExpressionHandlersOptions) => {
	React.useEffect(() => {
		const handleGifSelect = (payload?: unknown) => {
			const {gif, autoSend} = (payload ?? {}) as {gif?: KlipyGif; autoSend?: boolean};
			if (!gif) return;
			const gifUrl = gif.src || gif.url;
			if (autoSend) {
				sendOptimisticMessage({content: gifUrl}, {hasAttachments: false});
			} else {
				setValue((prevValue) => `${prevValue}${prevValue.length === 0 ? '' : ' '}${gifUrl} `);
				textareaRef.current?.focus();
			}
		};

		return ComponentDispatch.subscribe('GIF_SELECT', handleGifSelect);
	}, [sendOptimisticMessage, setValue, textareaRef]);

	React.useEffect(() => {
		const handleStickerSelect = (payload?: unknown) => {
			const {sticker} = (payload ?? {}) as {sticker?: GuildStickerRecord};
			if (!sticker) return;
			sendOptimisticMessage({content: '', stickers: [sticker.toJSON()]}, {hasAttachments: false});
		};

		return ComponentDispatch.subscribe('STICKER_SELECT', handleStickerSelect);
	}, [sendOptimisticMessage]);

	React.useEffect(() => {
		const handleFavoriteMemeSelect = (payload?: unknown) => {
			const {meme, autoSend} = (payload ?? {}) as {meme?: FavoriteMemeRecord; autoSend?: boolean};
			if (!meme) return;
			if (autoSend) {
				if (meme.klipyId) {
					const memeUrl = buildMemeUrl(meme.klipyId);
					sendOptimisticMessage({content: memeUrl}, {hasAttachments: false});
				} else {
					const uploadingAttachment = {
						id: 'uploading',
						filename: meme.filename,
						title: meme.name,
						size: meme.size,
						url: '',
						proxy_url: '',
						content_type: meme.contentType,
						flags: 0x1000,
					};

					sendOptimisticMessage(
						{content: '', attachments: [uploadingAttachment]},
						{hasAttachments: false, favoriteMemeId: meme.id},
					);
				}
			} else {
				if (meme.klipyId) {
					const memeUrl = buildMemeUrl(meme.klipyId);
					setValue((prevValue) => `${prevValue}${prevValue.length === 0 ? '' : ' '}${memeUrl} `);
				} else {
					setValue((prevValue) => `${prevValue}${prevValue.length === 0 ? '' : ' '}${meme.url} `);
				}
				textareaRef.current?.focus();
			}
		};

		return ComponentDispatch.subscribe('FAVORITE_MEME_SELECT', handleFavoriteMemeSelect);
	}, [sendOptimisticMessage, setValue, textareaRef]);

	React.useEffect(() => {
		const handleInsertMention = (payload?: unknown) => {
			const {userId} = (payload ?? {}) as {userId?: string};
			if (!userId) return;
			setValue((prevValue) => {
				const user = UserStore.getUser(userId);
				if (!user) {
					return prevValue;
				}

				const actualText = `<@${userId}>`;
				const displayText = `@${user.tag}`;
				const needsSpace = prevValue.length > 0 && !prevValue.endsWith(' ');
				const prefix = prevValue.length === 0 ? '' : needsSpace ? ' ' : '';
				const insertPosition = prevValue.length + prefix.length;

				const {newText} = insertSegment(prevValue + prefix, insertPosition, displayText, actualText, 'user', userId);

				if (previousValueRef.current !== null) {
					previousValueRef.current = newText;
				}
				return newText;
			});
			textareaRef.current?.focus();
		};

		return ComponentDispatch.subscribe('INSERT_MENTION', handleInsertMention);
	}, [insertSegment, previousValueRef, setValue, textareaRef]);
};
