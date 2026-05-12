/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class AclsMustBeNonEmptyError extends BadRequestError {
	constructor() {
		super({code: APIErrorCodes.ACLS_MUST_BE_NON_EMPTY, message: 'ACL не могут быть пустыми строками'});
	}
}
