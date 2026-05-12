/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export class InMemoryCoalescer {
	private pending = new Map<string, Promise<unknown>>();

	async coalesce<T>(key: string, fn: () => Promise<T>): Promise<T> {
		const existing = this.pending.get(key) as Promise<T> | undefined;

		if (existing) {
			return existing;
		}

		const promise = (async () => {
			try {
				return await fn();
			} finally {
				this.pending.delete(key);
			}
		})();

		this.pending.set(key, promise);
		return promise;
	}
}
