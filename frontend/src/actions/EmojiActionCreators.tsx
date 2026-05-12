/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Logger} from '~/lib/Logger';
import EmojiStore from '~/stores/EmojiStore';

const logger = new Logger('Emoji');

export const setSkinTone = (skinTone: string): void => {
	logger.debug(`Setting emoji skin tone: ${skinTone}`);
	EmojiStore.setSkinTone(skinTone);
};
