/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelOverride} from '~/database/CassandraTypes';
import {MuteConfiguration} from './MuteConfiguration';

export class GuildChannelOverride {
	readonly collapsed: boolean;
	readonly messageNotifications: number | null;
	readonly muted: boolean;
	readonly muteConfig: MuteConfiguration | null;

	constructor(override: ChannelOverride) {
		this.collapsed = override.collapsed ?? false;
		this.messageNotifications = override.message_notifications ?? null;
		this.muted = override.muted ?? false;
		this.muteConfig = override.mute_config ? new MuteConfiguration(override.mute_config) : null;
	}

	toChannelOverride(): ChannelOverride {
		return {
			collapsed: this.collapsed,
			message_notifications: this.messageNotifications,
			muted: this.muted,
			mute_config: this.muteConfig?.toMuteConfig() ?? null,
		};
	}
}
