/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

interface PickerOptions {
	multiple?: boolean;
	accept?: string;
}

export const openFilePicker = ({multiple = false, accept}: PickerOptions = {}): Promise<Array<File>> =>
	new Promise((resolve) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.multiple = multiple;
		if (accept) input.accept = accept;

		input.onchange = () => {
			const files = Array.from(input.files ?? []);
			resolve(files);
			input.remove();
		};
		input.oncancel = () => {
			resolve([]);
			input.remove();
		};

		input.click();
	});
