/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import {canFocusTextarea, type FocusableElementType, isInputFocused, safeFocus} from '~/lib/InputFocusManager';

export const useInputFocusManagement = (textareaRef: React.RefObject<FocusableElementType | null>) => {
	const safeFocusTextarea = React.useCallback(
		(force: boolean = false) => {
			if (!textareaRef.current) return false;
			return safeFocus(textareaRef.current, force);
		},
		[textareaRef],
	);

	const canFocus = React.useCallback(() => {
		if (!textareaRef.current) return false;
		return canFocusTextarea(textareaRef.current);
	}, [textareaRef]);

	const hasOtherInputFocused = React.useCallback(() => {
		return isInputFocused(textareaRef.current || undefined);
	}, [textareaRef]);

	return {
		safeFocusTextarea,
		canFocus,
		hasOtherInputFocused,
		isInputFocused: () => isInputFocused(textareaRef.current || undefined),
	};
};
