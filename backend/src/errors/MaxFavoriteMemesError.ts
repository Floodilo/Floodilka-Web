/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {APIErrorCodes, MAX_FAVORITE_MEMES_NON_PREMIUM, MAX_FAVORITE_MEMES_PREMIUM} from '~/Constants';
import {BadRequestError} from './BadRequestError';

export class MaxFavoriteMemesError extends BadRequestError {
	constructor(isPremium: boolean) {
		const limit = isPremium ? MAX_FAVORITE_MEMES_PREMIUM : MAX_FAVORITE_MEMES_NON_PREMIUM;
		super({
			code: APIErrorCodes.MAX_FAVORITE_MEMES,
			message: `Достигнуто максимальное количество избранных мемов (${limit}).`,
			data: {
				max_favorite_memes: limit,
				is_premium: isPremium,
			},
		});
	}
}
