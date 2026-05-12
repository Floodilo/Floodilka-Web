/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable} from 'mobx';
import {makePersistent} from '~/lib/MobXPersistence';

const IMPLICITLY_TRUSTED_DOMAINS = [
	'floodilka.com',
	'*.floodilka.com',
] as const;

const getCurrentHostname = (): string | undefined => {
	if (typeof location === 'undefined') {
		return undefined;
	}
	return location.hostname;
};

class TrustedDomainStore {
	trustedDomains: Array<string> = [];

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void this.initPersistence();
	}

	private async initPersistence(): Promise<void> {
		await makePersistent(this, 'TrustedDomainStore', ['trustedDomains']);
	}

	addTrustedDomain(domain: string): void {
		if (this.trustedDomains.includes(domain)) {
			return;
		}

		this.trustedDomains = [...this.trustedDomains, domain];
	}

	removeTrustedDomain(domain: string): void {
		if (!this.trustedDomains.includes(domain)) {
			return;
		}

		this.trustedDomains = this.trustedDomains.filter((d) => d !== domain);
	}

	isTrustedDomain(hostname: string): boolean {
		const currentHostname = getCurrentHostname();
		if (currentHostname && hostname === currentHostname) {
			return true;
		}

		for (const pattern of IMPLICITLY_TRUSTED_DOMAINS) {
			if (this.matchesDomainPattern(hostname, pattern)) {
				return true;
			}
		}

		return this.trustedDomains.some((pattern) => this.matchesDomainPattern(hostname, pattern));
	}

	private matchesDomainPattern(hostname: string, pattern: string): boolean {
		if (pattern.startsWith('*.')) {
			const baseDomain = pattern.slice(2);
			return hostname === baseDomain || hostname.endsWith(`.${baseDomain}`);
		}
		return hostname === pattern;
	}

	getTrustedDomains(): ReadonlyArray<string> {
		return this.trustedDomains;
	}
}

export default new TrustedDomainStore();
