/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {HttpError} from '~/lib/HttpError';

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

export function getApiErrorCode(error: unknown): string | undefined {
	if (!(error instanceof HttpError)) return undefined;
	if (!isRecord(error.body)) return undefined;
	const code = error.body.code;
	return typeof code === 'string' ? code : undefined;
}
