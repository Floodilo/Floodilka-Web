/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import UpdaterStore from '~/stores/UpdaterStore';

const CONTROLLER_CHANGE_TIMEOUT_MS = 4_000;

export const activateLatestServiceWorker = async (): Promise<void> => {
	if (!('serviceWorker' in navigator)) {
		return;
	}

	try {
		const registration = await navigator.serviceWorker.getRegistration();
		if (!registration) {
			return;
		}

		await registration.update().catch((error: unknown) => {
			console.warn('[Versioning] Failed to update service worker registration', error);
		});

		const postSkipWaiting = (worker: ServiceWorker | null) => {
			if (!worker) return;
			try {
				worker.postMessage({type: 'SKIP_WAITING'});
			} catch (error) {
				console.warn('[Versioning] Failed to postMessage SKIP_WAITING', error);
			}
		};

		if (registration.waiting) {
			postSkipWaiting(registration.waiting);
			await waitForActivation(registration.waiting);
		} else if (registration.installing) {
			const installing = registration.installing;

			await new Promise<void>((resolve) => {
				const handleStateChange = () => {
					if (installing.state === 'installed') {
						postSkipWaiting(registration.waiting);
						if (registration.waiting) {
							waitForActivation(registration.waiting).then(resolve);
						} else {
							resolve();
						}
					} else if (installing.state === 'activated') {
						resolve();
					}
				};

				if (installing.state === 'installed') {
					handleStateChange();
				} else if (installing.state === 'activated') {
					resolve();
				} else {
					installing.addEventListener('statechange', handleStateChange);
				}
			});
		}

		await waitForControllerChange();
	} catch (error) {
		console.warn('[Versioning] Failed to activate latest service worker', error);
	}
};

const waitForControllerChange = async (): Promise<void> => {
	if (!('serviceWorker' in navigator)) {
		return;
	}

	if (!navigator.serviceWorker.controller) {
		return;
	}

	await new Promise<void>((resolve) => {
		let settled = false;

		const timeoutId = window.setTimeout(() => {
			if (!settled) {
				settled = true;
				console.warn('[Versioning] Controller change timed out after', CONTROLLER_CHANGE_TIMEOUT_MS, 'ms');
				resolve();
			}
		}, CONTROLLER_CHANGE_TIMEOUT_MS);

		const handleControllerChange = () => {
			if (settled) return;
			settled = true;
			window.clearTimeout(timeoutId);
			navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
			resolve();
		};

		navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
	});
};

const waitForActivation = async (worker: ServiceWorker): Promise<void> => {
	return new Promise<void>((resolve) => {
		if (worker.state === 'activated') {
			resolve();
			return;
		}

		const handleStateChange = () => {
			if (worker.state === 'activated') {
				worker.removeEventListener('statechange', handleStateChange);
				resolve();
			}
		};

		worker.addEventListener('statechange', handleStateChange);

		setTimeout(() => {
			if (worker.state !== 'activated') {
				console.warn('[Versioning] Service worker activation timed out, current state:', worker.state);
				worker.removeEventListener('statechange', handleStateChange);
				resolve();
			}
		}, CONTROLLER_CHANGE_TIMEOUT_MS);
	});
};

export const ensureLatestAssets = async (options: {force?: boolean} = {}): Promise<{updateFound: boolean}> => {
	await UpdaterStore.checkForUpdates(options.force ?? false);
	return {updateFound: UpdaterStore.updateInfo.web.available};
};
