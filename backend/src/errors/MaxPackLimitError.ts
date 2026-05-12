/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class MaxPackLimitError extends BadRequestError {
	constructor(packType: 'emoji' | 'sticker', limit: number, action: 'create' | 'install') {
		const actionLabel = action === 'create' ? 'создать' : 'установить';
		const packTypeLabel = packType === 'emoji' ? 'эмодзи' : 'стикеров';
		super({
			code: APIErrorCodes.MAX_PACKS,
			message: `Вы можете ${actionLabel} не более ${limit} паков ${packTypeLabel}`,
			data: {
				pack_type: packType,
				limit,
				action,
			},
		});
	}
}
