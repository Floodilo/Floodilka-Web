/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MuteConfig} from '~/database/CassandraTypes';

export class MuteConfiguration {
	readonly endTime: Date | null;
	readonly selectedTimeWindow: number | null;

	constructor(config: MuteConfig) {
		this.endTime = config.end_time ?? null;
		this.selectedTimeWindow = config.selected_time_window ?? null;
	}

	toMuteConfig(): MuteConfig {
		return {
			end_time: this.endTime,
			selected_time_window: this.selectedTimeWindow,
		};
	}
}
