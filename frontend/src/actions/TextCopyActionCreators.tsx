/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {I18n} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {Logger} from '~/lib/Logger';
import {getElectronAPI, isDesktop} from '~/utils/NativeUtils';

const logger = new Logger('Clipboard');

const writeWithFallback = async (text: string): Promise<void> => {
	const electronApi = getElectronAPI();
	if (electronApi?.clipboardWriteText) {
		logger.debug('Using Electron clipboard');
		await electronApi.clipboardWriteText(text);
		return;
	}

	if (navigator.clipboard?.writeText) {
		logger.debug('Using navigator.clipboard');
		await navigator.clipboard.writeText(text);
		return;
	}

	logger.debug('Falling back to temporary textarea copy');
	const textarea = document.createElement('textarea');
	textarea.value = text;
	textarea.style.position = 'fixed';
	textarea.style.opacity = '0';
	document.body.appendChild(textarea);
	textarea.focus();
	textarea.select();
	const success = document.execCommand('copy');
	document.body.removeChild(textarea);
	if (success) return;

	throw new Error('No clipboard API available');
};

export const copy = async (i18n: I18n, text: string, suppressToast = false): Promise<boolean> => {
	try {
		logger.debug('Copying text to clipboard');
		if (!isDesktop()) {
			logger.debug('Desktop runtime not detected; continuing with web clipboard');
		}
		await writeWithFallback(text);
		logger.debug('Text successfully copied to clipboard');
		if (!suppressToast) {
			ToastActionCreators.createToast({type: 'success', children: i18n._(msg`Copied to clipboard`)});
		}
		return true;
	} catch (error) {
		logger.error('Failed to copy text to clipboard:', error);
		if (!suppressToast) {
			ToastActionCreators.createToast({type: 'error', children: i18n._(msg`Failed to copy to clipboard`)});
		}
		return false;
	}
};
