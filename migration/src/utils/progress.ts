/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export function createProgress(label: string, total: number) {
	let current = 0;
	const startTime = Date.now();

	return {
		tick(n = 1) {
			current += n;
			if (current % 500 === 0 || current === total) {
				const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
				const pct = ((current / total) * 100).toFixed(1);
				process.stdout.write(`\r  [${label}] ${current}/${total} (${pct}%) - ${elapsed}s`);
			}
		},
		done() {
			const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
			console.log(`\r  [${label}] ${current}/${total} done in ${elapsed}s`);
		},
	};
}
