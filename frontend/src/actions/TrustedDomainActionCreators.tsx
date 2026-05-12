/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Logger} from '~/lib/Logger';
import TrustedDomainStore from '~/stores/TrustedDomainStore';

const logger = new Logger('TrustedDomain');

export const addTrustedDomain = (domain: string): void => {
	logger.debug(`Adding trusted domain: ${domain}`);
	TrustedDomainStore.addTrustedDomain(domain);
};
