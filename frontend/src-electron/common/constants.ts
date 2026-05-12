/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const APP_PROTOCOL = 'floodilka';

const isDev = process.env.NODE_ENV === 'development';

export const STABLE_APP_URL = isDev ? 'http://localhost:8088' : 'https://floodilka.com';
export const CANARY_APP_URL = isDev ? 'http://localhost:8088' : 'https://stage.floodilka.com';

export const DEFAULT_WINDOW_WIDTH = 1280;
export const DEFAULT_WINDOW_HEIGHT = 800;
export const MIN_WINDOW_WIDTH = 800;
export const MIN_WINDOW_HEIGHT = 600;
