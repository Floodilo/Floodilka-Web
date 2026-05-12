/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import {useInputFocusManagement} from '~/hooks/useInputFocusManagement';

export const useTextareaAutofocus = (
	textareaRef: React.RefObject<HTMLTextAreaElement | null>,
	isMobile: boolean,
	enabled: boolean = true,
) => {
	const {safeFocusTextarea, canFocus} = useInputFocusManagement(textareaRef);

	React.useEffect(() => {
		if (!enabled || isMobile || !textareaRef.current) {
			return;
		}

		const timer = setTimeout(() => {
			safeFocusTextarea();
		}, 100);

		return () => clearTimeout(timer);
	}, [enabled, isMobile, safeFocusTextarea]);

	return {
		shouldAutoFocus: enabled && !isMobile,
		canFocusTextarea: canFocus,
		manualFocus: safeFocusTextarea,
	};
};
