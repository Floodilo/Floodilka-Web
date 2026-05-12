/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

const DB_NAME = 'FloodilkaBackgroundImages';
const DB_VERSION = 1;
const STORE_NAME = 'backgroundImages';

interface BackgroundImageData {
	id: string;
	blob: Blob;
	createdAt: number;
}

let dbInstance: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
	return new Promise((resolve, reject) => {
		if (dbInstance) {
			resolve(dbInstance);
			return;
		}

		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => {
			reject(new Error('Failed to open IndexedDB'));
		};

		request.onsuccess = () => {
			dbInstance = request.result;
			resolve(dbInstance);
		};

		request.onupgradeneeded = (event) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, {keyPath: 'id'});
			}
		};
	});
};

export const saveBackgroundImage = async (id: string, blob: Blob): Promise<void> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		const backgroundImage: BackgroundImageData = {
			id,
			blob,
			createdAt: Date.now(),
		};

		const request = store.put(backgroundImage);

		request.onsuccess = () => {
			resolve();
		};

		request.onerror = () => {
			reject(new Error('Failed to save background image'));
		};
	});
};

const getBackgroundImage = async (id: string): Promise<BackgroundImageData | null> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.get(id);

		request.onsuccess = () => {
			resolve(request.result || null);
		};

		request.onerror = () => {
			reject(new Error('Failed to get background image'));
		};
	});
};

export const deleteBackgroundImage = async (id: string): Promise<void> => {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.delete(id);

		request.onsuccess = () => {
			resolve();
		};

		request.onerror = () => {
			reject(new Error('Failed to delete background image'));
		};
	});
};

export const getBackgroundImageURL = async (id: string): Promise<string | null> => {
	const imageData = await getBackgroundImage(id);
	if (!imageData) return null;
	return URL.createObjectURL(imageData.blob);
};
