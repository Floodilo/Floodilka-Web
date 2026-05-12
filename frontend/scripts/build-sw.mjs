/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {buildServiceWorker} from './build/utils/service-worker.js';

const isProduction = process.env.NODE_ENV === 'production';

buildServiceWorker(isProduction).catch((error) => {
	console.error('Service worker build failed:', error);
	process.exit(1);
});
