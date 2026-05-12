/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function isGif(file: File): boolean {
	const type = (file.type || '').toLowerCase();
	if (type === 'image/gif') return true;

	const name = (file.name || '').toLowerCase();
	return name.endsWith('.gif');
}

export function revokeObjectUrl(url: string | null | undefined): void {
	if (!url) return;
	if (!url.startsWith('blob:')) return;
	try {
		URL.revokeObjectURL(url);
	} catch {}
}

export function blobToDataUrl(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = () => reject(new Error('Failed to read blob as data URL'));
		reader.readAsDataURL(blob);
	});
}

export function getSafeImageMimeType(file: File): string {
	const type = (file.type || '').toLowerCase();
	if (type.startsWith('image/')) return type;
	return 'image/png';
}
