/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class CannotShrinkReservedSlotsError extends BadRequestError {
	constructor(reservedSlotIndices: Array<number>) {
		super({
			code: APIErrorCodes.CANNOT_SHRINK_RESERVED_SLOTS,
			message: `Невозможно уменьшить слоты: ${reservedSlotIndices.length} слот(ов) с индексами [${reservedSlotIndices.join(', ')}] сейчас зарезервированы`,
		});
	}
}
