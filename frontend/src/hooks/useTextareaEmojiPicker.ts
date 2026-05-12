/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import * as ExpressionPickerActionCreators from '~/actions/ExpressionPickerActionCreators';
import * as PopoutActionCreators from '~/actions/PopoutActionCreators';
import EmojiStore, {type Emoji} from '~/stores/EmojiStore';
import type {MentionSegment} from '~/utils/TextareaSegmentManager';

interface UseTextareaEmojiPickerReturn {
	handleEmojiSelect: (emoji: Emoji, shiftKey?: boolean) => void;
}

interface UseTextareaEmojiPickerParams {
	setValue: React.Dispatch<React.SetStateAction<string>>;
	textareaRef: React.RefObject<HTMLTextAreaElement | null>;
	insertSegment: (
		currentText: string,
		insertPosition: number,
		displayText: string,
		actualText: string,
		type: MentionSegment['type'],
		id: string,
	) => {newText: string};
	previousValueRef: React.MutableRefObject<string>;
	channelId?: string;
}

export function useTextareaEmojiPicker({
	setValue,
	textareaRef,
	insertSegment,
	previousValueRef,
	channelId,
}: UseTextareaEmojiPickerParams): UseTextareaEmojiPickerReturn {
	const handleEmojiSelect = React.useCallback(
		(emoji: Emoji, shiftKey?: boolean) => {
			const actualText = EmojiStore.getEmojiMarkdown(emoji);
			const displayText = `:${emoji.name}:`;

			setValue((prevValue) => {
				const needsSpace = prevValue.length > 0 && !prevValue.endsWith(' ');
				const prefix = prevValue.length === 0 ? '' : needsSpace ? ' ' : '';
				const insertPosition = prevValue.length + prefix.length;

				const {newText} = insertSegment(
					prevValue + prefix,
					insertPosition,
					`${displayText} `,
					`${actualText} `,
					'emoji',
					emoji.id ?? emoji.uniqueName,
				);

				previousValueRef.current = newText;
				return newText;
			});
			textareaRef.current?.focus();

			if (!shiftKey && channelId) {
				ExpressionPickerActionCreators.close();
				PopoutActionCreators.close(`expression-picker-${channelId}`);
			}
		},
		[insertSegment, setValue, textareaRef, previousValueRef, channelId],
	);

	return {
		handleEmojiSelect,
	};
}
