/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/constants/API';
import {FloodilkaAPIError} from './FloodilkaAPIError';

export class AuditLogIndexingError extends FloodilkaAPIError {
	constructor() {
		super({
			code: APIErrorCodes.AUDIT_LOG_INDEXING,
			message: 'Журнал аудита сервера индексируется. Попробуйте позже.',
			status: 202,
		});
	}
}
