/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {FLOODILKA_EPOCH} from '~/Constants';

const BUCKET_SIZE = BigInt(1000 * 60 * 60 * 24 * 10);

export const makeBucket = (snowflake: bigint | null): number => {
	let timestamp: bigint;
	if (snowflake == null) {
		timestamp = BigInt(Date.now() - FLOODILKA_EPOCH);
	} else {
		timestamp = snowflake >> 22n;
	}
	return Math.floor(Number(timestamp / BUCKET_SIZE));
};

export const makeBuckets = (startId: bigint | null, endId: bigint | null = null): Array<number> => {
	const start = makeBucket(startId);
	const end = makeBucket(endId);
	const result: Array<number> = [];
	for (let i = start; i <= end; i++) {
		result.push(i);
	}
	return result;
};
