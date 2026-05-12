/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import * as DraftActionCreators from '~/actions/DraftActionCreators';
import * as ReplaceCommandUtils from '~/utils/ReplaceCommandUtils';
import {TypingUtils} from '~/utils/TypingUtils';

interface UseTextareaDraftAndTypingOptions {
	channelId: string;
	value: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	draft: string | null;
	previousValueRef: React.MutableRefObject<string>;
	isAutocompleteAttached: boolean;
	enabled: boolean;
}

export const useTextareaDraftAndTyping = ({
	channelId,
	value,
	setValue,
	draft,
	previousValueRef,
	isAutocompleteAttached,
	enabled,
}: UseTextareaDraftAndTypingOptions) => {
	const isRestoringDraftRef = React.useRef(false);

	React.useEffect(() => {
		if (!enabled) {
			TypingUtils.clear(channelId);
		}
	}, [channelId, enabled]);

	React.useLayoutEffect(() => {
		if (draft && previousValueRef.current !== undefined) {
			isRestoringDraftRef.current = true;
			setValue(draft);
			if (previousValueRef.current !== null) {
				previousValueRef.current = draft;
			}
			setTimeout(() => {
				isRestoringDraftRef.current = false;
			}, 0);
		}
	}, [draft, previousValueRef, setValue]);

	React.useEffect(() => {
		if (value) {
			DraftActionCreators.createDraft(channelId, value);
		} else {
			DraftActionCreators.deleteDraft(channelId);
		}
	}, [channelId, value]);

	React.useEffect(() => {
		if (isRestoringDraftRef.current) {
			return;
		}
		if (!enabled) {
			return;
		}

		const content = value.trim();
		const isInReplaceMode = ReplaceCommandUtils.isReplaceCommand(content);
		const isSlashCommand = content.startsWith('/');
		if (content && !isAutocompleteAttached && !isInReplaceMode && !isSlashCommand) {
			TypingUtils.typing(channelId);
		} else {
			TypingUtils.clear(channelId);
		}
	}, [channelId, value, isAutocompleteAttached]);
};
