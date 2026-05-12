/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {describe, expect, test} from 'vitest';
import {
	compare,
	extractTimestamp,
	fromTimestamp,
	fromTimestampWithSequence,
	SnowflakeSequence,
} from '~/utils/SnowflakeUtils';

describe('SnowflakeUtils', () => {
	test('extractTimestamp round-trips generated snowflakes without precision loss', () => {
		const timestamp = Date.now();
		const snowflake = fromTimestamp(timestamp);

		expect(extractTimestamp(snowflake)).toBe(timestamp);
	});

	test('extractTimestamp returns NaN for invalid inputs instead of throwing', () => {
		expect(extractTimestamp('not-a-valid-snowflake')).toBeNaN();
		expect(extractTimestamp('123')).toBeNaN();
	});

	test('fromTimestampWithSequence preserves the timestamp while the sequence makes later IDs larger', () => {
		const timestamp = Date.now();
		const sequence = new SnowflakeSequence();

		const first = fromTimestampWithSequence(timestamp, sequence);
		const second = fromTimestampWithSequence(timestamp, sequence);

		expect(extractTimestamp(first)).toBe(timestamp);
		expect(extractTimestamp(second)).toBe(timestamp);
		expect(compare(second, first)).toBeGreaterThan(0);
	});

	test('compare orders snowflakes by length and handles null values safely', () => {
		expect(compare(null, null)).toBe(0);
		expect(compare(null, '1')).toBe(-1);
		expect(compare('2', null)).toBe(1);
		expect(compare('99999999999999999', '1')).toBeGreaterThan(0);
		expect(compare('1', '2')).toBeLessThan(0);
	});
});
