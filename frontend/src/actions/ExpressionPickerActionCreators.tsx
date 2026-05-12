/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ExpressionPickerTabType} from '~/components/popouts/ExpressionPickerPopout';
import {Logger} from '~/lib/Logger';
import ExpressionPickerStore from '~/stores/ExpressionPickerStore';

const logger = new Logger('ExpressionPicker');

export const open = (channelId: string, tab?: ExpressionPickerTabType): void => {
	logger.debug(`Opening expression picker for channel ${channelId}, tab: ${tab}`);
	ExpressionPickerStore.open(channelId, tab);
};

export const close = (): void => {
	logger.debug('Closing expression picker');
	ExpressionPickerStore.close();
};

export const toggle = (channelId: string, tab: ExpressionPickerTabType): void => {
	logger.debug(`Toggling expression picker for channel ${channelId}, tab: ${tab}`);
	ExpressionPickerStore.toggle(channelId, tab);
};

export const setTab = (tab: ExpressionPickerTabType): void => {
	logger.debug(`Setting expression picker tab to: ${tab}`);
	ExpressionPickerStore.setTab(tab);
};
