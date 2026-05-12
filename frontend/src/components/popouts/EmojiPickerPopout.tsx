/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import {ExpressionPickerPopout} from '~/components/popouts/ExpressionPickerPopout';
import type {Emoji} from '~/stores/EmojiStore';

export const EmojiPickerPopout = observer(
	({
		channelId,
		handleSelect,
		onClose,
	}: {
		channelId: string | null;
		handleSelect: (emoji: Emoji, shiftKey?: boolean) => void;
		onClose?: () => void;
	}) => {
		const handleEmojiSelect = React.useCallback(
			(emoji: Emoji, shiftKey?: boolean) => {
				handleSelect(emoji, shiftKey);
				if (!shiftKey && onClose) {
					onClose();
				}
			},
			[handleSelect, onClose],
		);

		return (
			<ExpressionPickerPopout
				channelId={channelId ?? undefined}
				onEmojiSelect={handleEmojiSelect}
				onClose={onClose}
				visibleTabs={['emojis']}
			/>
		);
	},
);
