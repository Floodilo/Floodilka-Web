/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {describe, expect, it} from 'vitest';
import {parseString} from './StringUtils';

describe('StringUtils', () => {
	describe('parseString', () => {
		it('should decode HTML entities', () => {
			const result = parseString('&amp;&lt;&gt;&quot;', 50);
			expect(result).toBe('&<>"');
		});

		it('should trim whitespace', () => {
			const result = parseString('  hello world  ', 50);
			expect(result).toBe('hello world');
		});

		it('should truncate to max length', () => {
			const longString = 'This is a very long string that should be truncated';
			const result = parseString(longString, 20);

			expect(result.length).toBeLessThanOrEqual(20);
			expect(result).toBe('This is a very lo...');
		});

		it('should handle empty strings', () => {
			const result = parseString('', 50);
			expect(result).toBe('');
		});

		it('should handle strings with only whitespace', () => {
			const result = parseString('   ', 50);
			expect(result).toBe('');
		});

		it('should handle strings shorter than max length', () => {
			const shortString = 'hello';
			const result = parseString(shortString, 50);
			expect(result).toBe('hello');
		});

		it('should decode complex HTML entities and truncate', () => {
			const complexString = '&amp;lt;div&amp;gt;This is a test with HTML entities&amp;lt;/div&amp;gt;';
			const result = parseString(complexString, 20);

			expect(result.length).toBeLessThanOrEqual(20);
			expect(result.includes('&lt;div&gt;')).toBe(true);
		});

		it('should handle unicode characters', () => {
			const unicodeString = 'Hello 🌍 World';
			const result = parseString(unicodeString, 50);
			expect(result).toBe('Hello 🌍 World');
		});

		it('should handle newlines and tabs in trimming', () => {
			const result = parseString('\n\t  hello world  \t\n', 50);
			expect(result).toBe('hello world');
		});

		it('should preserve internal whitespace while trimming external', () => {
			const result = parseString('  hello   world  ', 50);
			expect(result).toBe('hello   world');
		});

		it('should handle maxLength of 0', () => {
			const result = parseString('hello world', 0);
			expect(result).toBe('...');
		});

		it('should handle maxLength of 1', () => {
			const result = parseString('hello world', 1);
			expect(result).toBe('...');
		});
	});
});
