/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, runInAction} from 'mobx';
import HttpClient from '~/lib/HttpClient';

interface GeoIPData {
	countryCode: string;
	regionCode: string | null;
	latitude: string;
	longitude: string;
}

class GeoIPStore {
	countryCode: string | null = null;
	regionCode: string | null = null;
	latitude: string | null = null;
	longitude: string | null = null;
	loaded = false;
	error: string | null = null;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	async fetchGeoData(): Promise<void> {
		try {
			const response = await HttpClient.get<GeoIPData>('/geoip');
			if (!response.ok) {
				throw new Error(`Failed to fetch geo data: ${response.status}`);
			}

			const data = response.body;

			runInAction(() => {
				this.countryCode = data.countryCode;
				this.regionCode = data.regionCode;
				this.latitude = data.latitude;
				this.longitude = data.longitude;
				this.loaded = true;
				this.error = null;
			});
		} catch (error) {
			runInAction(() => {
				this.countryCode = null;
				this.regionCode = null;
				this.latitude = null;
				this.longitude = null;
				this.loaded = true;
				this.error = error instanceof Error ? error.message : 'Unknown error';
			});
		}
	}
}

export default new GeoIPStore();
