/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {configurePersistable, makePersistable, stopPersisting} from 'mobx-persist-store';
import {Logger} from './Logger';

const logger = new Logger('MobXPersistence');

const persistedStores = new Set<string>();

const getStorage = () => {
	return 'localStorage' in window ? window.localStorage : undefined;
};

configurePersistable({
	storage: getStorage(),
	expireIn: undefined,
	removeOnExpiration: false,
	stringify: true,
	debugMode: false,
});

export const makePersistent = async <T extends object>(
	store: T,
	storageKey: string,
	properties: Array<keyof T>,
	options?: {
		expireIn?: number;
		removeOnExpiration?: boolean;
		version?: number;
	},
): Promise<void> => {
	try {
		if (persistedStores.has(storageKey)) {
			logger.debug(`Store ${storageKey} is already being persisted, skipping...`);
			return;
		}

		await makePersistable(store, {
			name: storageKey,
			properties: properties as Array<keyof T & string>,
			storage: getStorage(),
			expireIn: options?.expireIn,
			removeOnExpiration: options?.removeOnExpiration,
			stringify: true,
			version: options?.version ?? 1,
		});

		persistedStores.add(storageKey);
		logger.debug(`Store ${storageKey} hydrated from localStorage and is now persisting.`);
	} catch (error) {
		logger.error(`Failed to hydrate store ${storageKey}:`, error);
	}
};

export const stopPersistent = (storageKey: string, store: object): void => {
	try {
		stopPersisting(store);
		persistedStores.delete(storageKey);
		logger.debug(`Stopped persisting store: ${storageKey}`);
	} catch (error) {
		logger.error(`Failed to stop persisting store ${storageKey}:`, error);
	}
};
