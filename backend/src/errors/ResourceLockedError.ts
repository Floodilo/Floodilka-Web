/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {LockedError} from './LockedError';

export class ResourceLockedError extends LockedError {
	constructor(message: string = 'Ресурс сейчас заблокирован. Попробуйте позже.') {
		super({
			code: APIErrorCodes.GENERAL_ERROR,
			message,
			headers: {'Retry-After': '2'},
		});
	}
}
