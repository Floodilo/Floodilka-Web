/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import {ComponentDispatch} from '~/lib/ComponentDispatch';
import type {MessageRecord} from '~/records/MessageRecord';

interface UseTextareaEditingOptions {
	channelId: string;
	editingMessageId: string | null;
	editingMessage: MessageRecord | null;
	isMobileEditMode: boolean;
	replyingMessage: {messageId: string; mentioning: boolean} | null;
	value: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	textareaRef: React.RefObject<HTMLTextAreaElement | null>;
	previousValueRef: React.MutableRefObject<string>;
}

export const useTextareaEditing = ({
	editingMessageId,
	editingMessage,
	isMobileEditMode,
	replyingMessage,
	value,
	setValue,
	textareaRef,
	previousValueRef,
}: UseTextareaEditingOptions) => {
	const [wasEditing, setWasEditing] = React.useState(false);
	const hasInitializedEditingRef = React.useRef(false);
	const notifyLayoutResized = React.useCallback(() => {
		ComponentDispatch.dispatch('LAYOUT_RESIZED');
	}, []);

	React.useEffect(() => {
		if (editingMessageId) {
			setWasEditing(true);
		} else if (wasEditing) {
			textareaRef.current?.focus();
			textareaRef.current?.setSelectionRange(value.length, value.length);
			setWasEditing(false);
		}
	}, [editingMessageId, wasEditing, value.length, textareaRef]);

	React.useEffect(() => {
		if (editingMessage && isMobileEditMode) {
			if (!hasInitializedEditingRef.current) {
				hasInitializedEditingRef.current = true;
				setValue(editingMessage.content);
				if (previousValueRef.current !== null) {
					previousValueRef.current = editingMessage.content;
				}
				textareaRef.current?.focus();
				textareaRef.current?.setSelectionRange(editingMessage.content.length, editingMessage.content.length);
			}
		} else {
			hasInitializedEditingRef.current = false;
		}
	}, [editingMessage, isMobileEditMode, previousValueRef, setValue, textareaRef]);

	React.useEffect(() => {
		if (editingMessage && isMobileEditMode) {
			notifyLayoutResized();
		}
	}, [editingMessage, isMobileEditMode, notifyLayoutResized]);

	React.useEffect(() => {
		if (replyingMessage) {
			notifyLayoutResized();
		}
	}, [replyingMessage, notifyLayoutResized]);
};
