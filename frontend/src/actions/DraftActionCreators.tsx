/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Logger} from '~/lib/Logger';
import DraftStore from '~/stores/DraftStore';

const logger = new Logger('Draft');

export const createDraft = (channelId: string, content: string): void => {
	logger.debug(`Creating draft for channel ${channelId}`);
	DraftStore.createDraft(channelId, content);
};

export const deleteDraft = (channelId: string): void => {
	logger.debug(`Deleting draft for channel ${channelId}`);
	DraftStore.deleteDraft(channelId);
};
