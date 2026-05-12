/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/constants/API';
import {ForbiddenError} from './ForbiddenError';

export class SudoModeRequiredError extends ForbiddenError {
	constructor(hasMfa: boolean) {
		super({
			code: APIErrorCodes.SUDO_MODE_REQUIRED,
			message: 'Для этого действия требуется подтверждение паролем или двухфакторной аутентификацией',
			data: {
				has_mfa: hasMfa,
			},
		});
	}
}
