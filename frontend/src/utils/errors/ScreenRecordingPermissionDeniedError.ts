/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export class ScreenRecordingPermissionDeniedError extends Error {
	displayName = 'ScreenRecordingPermissionDeniedError';

	constructor(message = 'Screen recording permission denied') {
		super(message);
		this.name = 'ScreenRecordingPermissionDeniedError';
	}
}
