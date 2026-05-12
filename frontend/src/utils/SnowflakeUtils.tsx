/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {FLOODILKA_EPOCH} from '~/Constants';

const MAX_SEQUENCE = 4095;
const TIMESTAMP_SHIFT = 22;

export function extractTimestamp(snowflake: string): number {
	if (!/^\d{17,19}$/.test(snowflake)) {
		return Number.NaN;
	}

	try {
		const shifted = BigInt(snowflake) >> BigInt(TIMESTAMP_SHIFT);
		return Number(shifted) + FLOODILKA_EPOCH;
	} catch (_error) {
		return Number.NaN;
	}
}

export function fromTimestamp(timestamp: number): string {
	const adjustedTimestamp = timestamp - FLOODILKA_EPOCH;

	if (adjustedTimestamp <= 0) {
		return '0';
	}

	return (BigInt(adjustedTimestamp) << BigInt(TIMESTAMP_SHIFT)).toString();
}

export function fromTimestampWithSequence(timestamp: number, sequence: SnowflakeSequence): string {
	const adjustedTimestamp = timestamp - FLOODILKA_EPOCH;
	const timestampValue = adjustedTimestamp <= 0 ? 0 : adjustedTimestamp;

	return ((BigInt(timestampValue) << BigInt(TIMESTAMP_SHIFT)) + BigInt(sequence.next())).toString();
}

export function atPreviousMillisecond(snowflake: string): string {
	return fromTimestamp(extractTimestamp(snowflake) - 1);
}

export function atNextMillisecond(snowflake: string): string {
	return fromTimestamp(extractTimestamp(snowflake) + 1);
}

export function compare(snowflake1: string | null, snowflake2: string | null): number {
	if (snowflake1 === snowflake2) return 0;
	if (snowflake2 == null) return 1;
	if (snowflake1 == null) return -1;
	if (snowflake1.length > snowflake2.length) return 1;
	if (snowflake1.length < snowflake2.length) return -1;
	return snowflake1 > snowflake2 ? 1 : -1;
}

export function isProbablyAValidSnowflake(value: string | null | undefined): boolean {
	if (value == null || !/^\d{17,19}$/.test(value)) {
		return false;
	}

	try {
		return extractTimestamp(value) >= FLOODILKA_EPOCH;
	} catch (_error) {
		return false;
	}
}

export function sortBySnowflakeDesc<T extends {id: string}>(items: ReadonlyArray<T>): Array<T> {
	return [...items].sort((a, b) => compare(b.id, a.id));
}

export function age(snowflake: string): number {
	const timestamp = extractTimestamp(snowflake);
	return Number.isNaN(timestamp) ? 0 : Date.now() - timestamp;
}

export class SnowflakeSequence {
	private seq: number;

	constructor() {
		this.seq = 0;
	}

	next(): number {
		if (this.seq > MAX_SEQUENCE) {
			throw new Error(`Snowflake sequence number overflow: ${this.seq}`);
		}
		return this.seq++;
	}

	willOverflowNext(): boolean {
		return this.seq > MAX_SEQUENCE;
	}

	reset(): void {
		this.seq = 0;
	}
}
