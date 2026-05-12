/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {PackController} from './PackController';
import {PackEmojiController} from './PackEmojiController';
import {PackStickerController} from './PackStickerController';

export const registerPackControllers = (app: HonoApp) => {
	PackController(app);
	PackEmojiController(app);
	PackStickerController(app);
};
