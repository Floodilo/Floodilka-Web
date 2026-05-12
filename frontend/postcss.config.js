/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import autoprefixer from 'autoprefixer';
import postcssDiscardComments from 'postcss-discard-comments';
import postcssPresetEnv from 'postcss-preset-env';

export default {
	plugins: [
		postcssDiscardComments({
			removeAll: true,
		}),
		postcssPresetEnv({
			stage: 3,
			features: {
				'nesting-rules': true,
				'custom-properties': true,
				'custom-media-queries': true,
			},
			browsers: 'last 10 years, > 0.5%, not dead',
		}),
		autoprefixer({
			flexbox: 'no-2009',
			grid: 'no-autoplace',
		}),
	],
};
