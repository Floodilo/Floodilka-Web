/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {Logger} from '~/lib/Logger';

const logger = new Logger('CountryCodeStore');

class CountryCodeStore {
	countryCode = 'US';

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	setCountryCode(countryCode: string): void {
		this.countryCode = countryCode;
		logger.debug(`Set country code: ${countryCode}`);
	}
}

export default new CountryCodeStore();
