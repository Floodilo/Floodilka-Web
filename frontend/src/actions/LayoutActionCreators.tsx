/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Logger} from '~/lib/Logger';
import MemberListStore from '~/stores/MemberListStore';
import MobileLayoutStore from '~/stores/MobileLayoutStore';

const logger = new Logger('Layout');

export const updateMobileLayoutState = (navExpanded: boolean, chatExpanded: boolean): void => {
	logger.debug(`Updating mobile layout state: nav=${navExpanded}, chat=${chatExpanded}`);
	MobileLayoutStore.updateState({navExpanded, chatExpanded});
};

export const toggleMembers = (_isOpen: boolean): void => {
	MemberListStore.toggleMembers();
};
