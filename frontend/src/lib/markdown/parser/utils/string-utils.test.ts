/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {describe, expect, test} from 'vitest';
import {isAlphaNumericChar, matchMarker, startsWithUrl} from './string-utils';

describe('String Utils', () => {
	describe('isAlphaNumericChar', () => {
		test('should return true for alphanumeric characters', () => {
			expect(isAlphaNumericChar('a')).toBe(true);
			expect(isAlphaNumericChar('Z')).toBe(true);
			expect(isAlphaNumericChar('5')).toBe(true);
			expect(isAlphaNumericChar('0')).toBe(true);
		});

		test('should return false for non-alphanumeric characters', () => {
			expect(isAlphaNumericChar('!')).toBe(false);
			expect(isAlphaNumericChar(' ')).toBe(false);
			expect(isAlphaNumericChar('@')).toBe(false);
			expect(isAlphaNumericChar('-')).toBe(false);
		});

		test('should return false for multi-character strings', () => {
			expect(isAlphaNumericChar('ab')).toBe(false);
			expect(isAlphaNumericChar('12')).toBe(false);
			expect(isAlphaNumericChar('')).toBe(false);
		});
	});

	describe('startsWithUrl', () => {
		test('should return true for valid HTTP URLs', () => {
			expect(startsWithUrl('http://example.com')).toBe(true);
			expect(startsWithUrl('http://sub.domain.com/path')).toBe(true);
		});

		test('should return true for valid HTTPS URLs', () => {
			expect(startsWithUrl('https://example.com')).toBe(true);
			expect(startsWithUrl('https://secure.site.org/page')).toBe(true);
		});

		test('should return false for URLs with quotes in protocol', () => {
			expect(startsWithUrl('ht"tp://example.com')).toBe(false);
			expect(startsWithUrl("htt'p://example.com")).toBe(false);
			expect(startsWithUrl('https"://example.com')).toBe(false);
			expect(startsWithUrl("http's://example.com")).toBe(false);
		});

		test('should return false for too short strings', () => {
			expect(startsWithUrl('http')).toBe(false);
			expect(startsWithUrl('https')).toBe(false);
			expect(startsWithUrl('http:/')).toBe(false);
			expect(startsWithUrl('')).toBe(false);
		});

		test('should return false for non-URL strings', () => {
			expect(startsWithUrl('ftp://example.com')).toBe(false);
			expect(startsWithUrl('mailto:test@example.com')).toBe(false);
			expect(startsWithUrl('not a url')).toBe(false);
		});
	});

	describe('matchMarker', () => {
		test('should match single character markers', () => {
			const chars = ['a', 'b', 'c', 'd'];
			expect(matchMarker(chars, 0, 'a')).toBe(true);
			expect(matchMarker(chars, 1, 'b')).toBe(true);
			expect(matchMarker(chars, 0, 'x')).toBe(false);
		});

		test('should match two character markers', () => {
			const chars = ['a', 'b', 'c', 'd'];
			expect(matchMarker(chars, 0, 'ab')).toBe(true);
			expect(matchMarker(chars, 1, 'bc')).toBe(true);
			expect(matchMarker(chars, 0, 'ac')).toBe(false);
		});

		test('should match longer markers', () => {
			const chars = ['h', 'e', 'l', 'l', 'o'];
			expect(matchMarker(chars, 0, 'hello')).toBe(true);
			expect(matchMarker(chars, 1, 'ello')).toBe(true);
			expect(matchMarker(chars, 0, 'help')).toBe(false);
		});

		test('should return false when marker extends beyond array', () => {
			const chars = ['a', 'b'];
			expect(matchMarker(chars, 0, 'abc')).toBe(false);
			expect(matchMarker(chars, 1, 'bc')).toBe(false);
			expect(matchMarker(chars, 2, 'c')).toBe(false);
		});

		test('should handle empty marker', () => {
			const chars = ['a', 'b', 'c'];
			expect(matchMarker(chars, 0, '')).toBe(true);
			expect(matchMarker(chars, 1, '')).toBe(true);
		});

		test('should handle edge positions', () => {
			const chars = ['x', 'y', 'z'];
			expect(matchMarker(chars, 0, 'x')).toBe(true);
			expect(matchMarker(chars, 2, 'z')).toBe(true);
			expect(matchMarker(chars, 3, 'a')).toBe(false);
		});
	});
});
