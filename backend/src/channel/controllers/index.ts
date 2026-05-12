/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {CallController} from './CallController';
import {ChannelController} from './ChannelController';
import {MessageController} from './MessageController';
import {MessageInteractionController} from './MessageInteractionController';
import {ScheduledMessageController} from './ScheduledMessageController';
import {StreamController} from './StreamController';

export const registerChannelControllers = (app: HonoApp) => {
	ChannelController(app);
	MessageInteractionController(app);
	MessageController(app);
	ScheduledMessageController(app);
	CallController(app);
	StreamController(app);
};
