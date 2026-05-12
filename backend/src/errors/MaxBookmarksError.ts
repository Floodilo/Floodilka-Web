/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes, MAX_BOOKMARKS_NON_PREMIUM, MAX_BOOKMARKS_PREMIUM} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class MaxBookmarksError extends BadRequestError {
	constructor(isPremium: boolean) {
		const limit = isPremium ? MAX_BOOKMARKS_PREMIUM : MAX_BOOKMARKS_NON_PREMIUM;
		super({
			code: APIErrorCodes.MAX_BOOKMARKS,
			message: `Достигнуто максимальное количество закладок (${limit}).`,
			data: {
				max_bookmarks: limit,
				is_premium: isPremium,
			},
		});
	}
}
