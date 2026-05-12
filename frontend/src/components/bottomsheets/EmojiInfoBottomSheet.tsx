/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {BottomSheet} from '~/components/uikit/BottomSheet/BottomSheet';
import UnicodeEmojis from '~/lib/UnicodeEmojis';
import EmojiStore from '~/stores/EmojiStore';
import GuildStore from '~/stores/GuildStore';
import * as AvatarUtils from '~/utils/AvatarUtils';
import * as EmojiUtils from '~/utils/EmojiUtils';
import {shouldUseNativeEmoji} from '~/utils/EmojiUtils';
import styles from './EmojiInfoBottomSheet.module.css';

interface EmojiInfoData {
	id?: string;
	name: string;
	animated?: boolean;
}

interface EmojiInfoBottomSheetProps {
	isOpen: boolean;
	onClose: () => void;
	emoji: EmojiInfoData | null;
}

const EMOJI_SHEET_SNAP_POINTS: Array<number> = [0, 0.4, 0.5];

export const EmojiInfoBottomSheet: React.FC<EmojiInfoBottomSheetProps> = observer(({isOpen, onClose, emoji}) => {
	if (!isOpen || !emoji) {
		return null;
	}

	return <EmojiInfoBottomSheetContent emoji={emoji} onClose={onClose} />;
});

interface EmojiInfoBottomSheetContentProps {
	emoji: EmojiInfoData;
	onClose: () => void;
}

const EmojiInfoBottomSheetContent: React.FC<EmojiInfoBottomSheetContentProps> = observer(({emoji, onClose}) => {
	const isCustomEmoji = emoji.id != null;
	const emojiRecord = isCustomEmoji ? EmojiStore.getEmojiById(emoji.id!) : null;
	const guildId = emojiRecord?.guildId;
	const guild = guildId ? GuildStore.getGuild(guildId) : null;

	const emojiUrl = React.useMemo(() => {
		if (isCustomEmoji) {
			const url = AvatarUtils.getEmojiURL({id: emoji.id!, animated: emoji.animated ?? false});
			return `${url}?size=240&quality=lossless`;
		}
		if (shouldUseNativeEmoji) {
			return null;
		}
		return EmojiUtils.getEmojiURL(emoji.name);
	}, [emoji.id, emoji.name, emoji.animated, isCustomEmoji]);

	const getEmojiDisplayName = (): string => {
		if (isCustomEmoji) {
			return `:${emoji.name}:`;
		}
		return UnicodeEmojis.convertSurrogateToName(emoji.name, true, `:${emoji.name}:`);
	};

	const emojiName = getEmojiDisplayName();

	const renderSubtext = () => {
		if (!isCustomEmoji) {
			return (
				<span className={styles.subtext}>
					<Trans>Default emoji</Trans>
				</span>
			);
		}

		if (guild) {
			return (
				<span className={styles.subtext}>
					<Trans>From {guild.name}</Trans>
				</span>
			);
		}

		return (
			<span className={styles.subtext}>
				<Trans>From another server</Trans>
			</span>
		);
	};

	return (
		<BottomSheet
			isOpen={true}
			onClose={onClose}
			snapPoints={EMOJI_SHEET_SNAP_POINTS}
			initialSnap={EMOJI_SHEET_SNAP_POINTS.length - 1}
			showCloseButton={false}
		>
			<div className={styles.content}>
				<div className={styles.emojiContainer}>
					{emojiUrl ? (
						<img src={emojiUrl} alt={emoji.name} draggable={false} className={styles.emoji} />
					) : (
						<span className={styles.nativeEmoji}>{emoji.name}</span>
					)}
				</div>
				<div className={styles.infoContainer}>
					<span className={styles.emojiName}>{emojiName}</span>
					{renderSubtext()}
				</div>
			</div>
		</BottomSheet>
	);
});
