/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {Logger} from '~/lib/Logger';

const logger = new Logger('AutocompleteStore');

class AutocompleteStore {
	highlightChannelId: string | null = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	highlightChannel(channelId: string): void {
		if (!channelId || this.highlightChannelId === channelId) {
			return;
		}

		this.highlightChannelId = channelId;
		logger.debug(`Highlighted channel: ${channelId}`);
	}

	highlightChannelClear(): void {
		if (this.highlightChannelId == null) {
			return;
		}

		this.highlightChannelId = null;
		logger.debug('Cleared channel highlight');
	}
}

export default new AutocompleteStore();
