/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import {isTextInputKeyEvent} from '~/lib/isTextInputKeyEvent';
import ModalStore from '~/stores/ModalStore';
import QuickSwitcherStore from '~/stores/QuickSwitcherStore';

const MODAL_KEYBOARD_SELECTOR = '[role="dialog"], .modal-backdrop';

const isTextEntryElement = (element: Element | null): boolean => {
	if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
		return true;
	}
	return element instanceof HTMLElement && element.isContentEditable;
};

const isElementInsideModal = (element: Element | null): boolean => {
	return Boolean(element?.closest(MODAL_KEYBOARD_SELECTOR));
};

interface SearchInputRef {
	current: HTMLInputElement | null;
}

export const useSearchInputAutofocus = (inputRef: SearchInputRef) => {
	React.useEffect(() => {
		const shouldBlockDueToModal = (): boolean => {
			if (!ModalStore.hasModalOpen()) {
				return false;
			}
			const input = inputRef.current;
			return !isElementInsideModal(input);
		};

		if (!shouldBlockDueToModal()) {
			inputRef.current?.focus({preventScroll: true});
		}

		const handleGlobalKeyDown = (event: KeyboardEvent) => {
			if (QuickSwitcherStore.getIsOpen()) {
				return;
			}

			if (shouldBlockDueToModal()) {
				return;
			}

			const activeElement = document.activeElement;

			if (activeElement === inputRef.current) {
				return;
			}

			if (isTextEntryElement(activeElement)) {
				return;
			}

			if (!isTextInputKeyEvent(event)) {
				return;
			}

			inputRef.current?.focus({preventScroll: true});
		};

		document.addEventListener('keydown', handleGlobalKeyDown);
		return () => document.removeEventListener('keydown', handleGlobalKeyDown);
	}, [inputRef]);
};
