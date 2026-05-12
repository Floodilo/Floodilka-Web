/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

interface CacheEntry {
	devices: Array<MediaDeviceInfo>;
	timestamp: number;
}

type PermissionType = 'audio' | 'video';

class MediaDeviceCache {
	private cache: Map<PermissionType, CacheEntry> = new Map();
	private readonly STALE_TIME = 5000;
	private revalidationPromises: Map<PermissionType, Promise<Array<MediaDeviceInfo>>> = new Map();

	public async getDevices(
		type: PermissionType,
		fetchFn: () => Promise<Array<MediaDeviceInfo>>,
	): Promise<{devices: Array<MediaDeviceInfo>; isStale: boolean}> {
		const cached = this.cache.get(type);
		const now = Date.now();

		if (cached && now - cached.timestamp < this.STALE_TIME) {
			return {devices: cached.devices, isStale: false};
		}

		if (cached) {
			if (!this.revalidationPromises.has(type)) {
				const revalidationPromise = this.revalidate(type, fetchFn);
				this.revalidationPromises.set(type, revalidationPromise);
				revalidationPromise.finally(() => {
					this.revalidationPromises.delete(type);
				});
			}
			return {devices: cached.devices, isStale: true};
		}

		try {
			const devices = await fetchFn();
			this.cache.set(type, {devices, timestamp: now});
			return {devices, isStale: false};
		} catch (_error) {
			return {devices: [], isStale: false};
		}
	}

	private async revalidate(
		type: PermissionType,
		fetchFn: () => Promise<Array<MediaDeviceInfo>>,
	): Promise<Array<MediaDeviceInfo>> {
		try {
			const devices = await fetchFn();
			this.cache.set(type, {devices, timestamp: Date.now()});
			return devices;
		} catch (_error) {
			return this.cache.get(type)?.devices ?? [];
		}
	}

	public invalidate(type: PermissionType): void {
		this.cache.delete(type);
		this.revalidationPromises.delete(type);
	}

	public clear(): void {
		this.cache.clear();
		this.revalidationPromises.clear();
	}

	public startDeviceChangeListener(): () => void {
		const mediaDevices = navigator.mediaDevices;
		if (!mediaDevices || typeof mediaDevices.addEventListener !== 'function') {
			const previousHandler = mediaDevices?.ondevicechange ?? null;
			const handleDeviceChange = (event: Event) => {
				this.clear();
				previousHandler?.call(mediaDevices ?? undefined, event);
			};

			if (mediaDevices) {
				mediaDevices.ondevicechange = handleDeviceChange;
			}

			return () => {
				if (mediaDevices) {
					mediaDevices.ondevicechange = previousHandler;
				}
			};
		}

		const handleDeviceChange = () => {
			this.clear();
		};

		mediaDevices.addEventListener('devicechange', handleDeviceChange);

		return () => {
			mediaDevices.removeEventListener('devicechange', handleDeviceChange);
		};
	}
}

export const mediaDeviceCache = new MediaDeviceCache();
