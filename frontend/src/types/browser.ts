/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {
	ExtendedDocument,
	ExtendedHTMLElement,
	ExtendedHTMLVideoElement,
	ExtendedWindow,
	LegacyDocumentSelection,
} from './browser.d';

export type {ExtendedDocument, ExtendedHTMLElement, ExtendedHTMLVideoElement, ExtendedWindow, LegacyDocumentSelection};

export function isLegacyDocument(_document: Document): _document is Document & LegacyDocumentSelection {
	return 'selection' in _document && (_document as any).selection !== undefined;
}

export function supportsWebkitFullscreen(_document: Document): _document is ExtendedDocument {
	return 'webkitFullscreenElement' in _document;
}

export function supportsMozFullscreen(_document: Document): _document is ExtendedDocument {
	return 'mozFullScreenElement' in _document;
}

export function supportsMsFullscreen(_document: Document): _document is ExtendedDocument {
	return 'msFullscreenElement' in _document;
}

export function supportsWebkitRequestFullscreen(_element: HTMLElement): _element is ExtendedHTMLElement {
	return 'webkitRequestFullscreen' in _element;
}

export function supportsMozRequestFullScreen(_element: HTMLElement): _element is ExtendedHTMLElement {
	return 'mozRequestFullScreen' in _element;
}

export function supportsMsRequestFullscreen(_element: HTMLElement): _element is ExtendedHTMLElement {
	return 'msRequestFullscreen' in _element;
}

export function supportsDisablePictureInPicture(
	_video: HTMLVideoElement,
): _video is HTMLVideoElement & {disablePictureInPicture?: boolean} {
	return 'disablePictureInPicture' in _video;
}

export function supportsShowSaveFilePicker(
	_window: Window,
): _window is Window & {showSaveFilePicker?: (options: SaveFilePickerOptions) => Promise<FileSystemFileHandle>} {
	return 'showSaveFilePicker' in _window;
}

export function supportsRequestIdleCallback(
	_window: Window,
): _window is Window & {requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number} {
	return 'requestIdleCallback' in _window;
}

export function getExtendedDocument(): ExtendedDocument {
	return document as ExtendedDocument;
}

export function getExtendedWindow(): ExtendedWindow {
	return window as unknown as ExtendedWindow;
}
