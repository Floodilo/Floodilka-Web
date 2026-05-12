/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {beforeEach, describe, expect, test} from 'vitest';
import {FormattingContext} from './formatting-context';

describe('FormattingContext', () => {
	let context: FormattingContext;

	beforeEach(() => {
		context = new FormattingContext();
	});

	describe('pushFormatting and popFormatting', () => {
		test('should push and pop formatting markers correctly', () => {
			context.pushFormatting('*', true);
			context.pushFormatting('_', false);

			expect(context.popFormatting()).toEqual(['_', false]);
			expect(context.popFormatting()).toEqual(['*', true]);
		});

		test('should handle empty stack when popping', () => {
			expect(context.popFormatting()).toBeUndefined();
		});

		test('should update active formatting types when pushing', () => {
			context.pushFormatting('*', true);
			expect(context.isFormattingActive('*', true)).toBe(true);
			expect(context.isFormattingActive('*', false)).toBe(false);
		});

		test('should remove active formatting types when popping', () => {
			context.pushFormatting('*', true);
			expect(context.isFormattingActive('*', true)).toBe(true);

			context.popFormatting();
			expect(context.isFormattingActive('*', true)).toBe(false);
		});

		test('should handle multiple formatting markers of same type', () => {
			context.pushFormatting('*', true);
			context.pushFormatting('*', false);

			expect(context.isFormattingActive('*', true)).toBe(true);
			expect(context.isFormattingActive('*', false)).toBe(true);

			context.popFormatting();
			expect(context.isFormattingActive('*', false)).toBe(false);
			expect(context.isFormattingActive('*', true)).toBe(true);

			context.popFormatting();
			expect(context.isFormattingActive('*', true)).toBe(false);
		});
	});

	describe('isFormattingActive', () => {
		test('should detect active formatting correctly', () => {
			context.pushFormatting('*', true);
			expect(context.isFormattingActive('*', true)).toBe(true);
			expect(context.isFormattingActive('*', false)).toBe(false);
			expect(context.isFormattingActive('_', true)).toBe(false);
		});

		test('should handle different marker and emphasis combinations', () => {
			context.pushFormatting('_', true);
			context.pushFormatting('*', false);
			context.pushFormatting('~', true);

			expect(context.isFormattingActive('_', true)).toBe(true);
			expect(context.isFormattingActive('*', false)).toBe(true);
			expect(context.isFormattingActive('~', true)).toBe(true);
			expect(context.isFormattingActive('_', false)).toBe(false);
		});
	});

	describe('canEnterFormatting', () => {
		test('should allow formatting when not active', () => {
			expect(context.canEnterFormatting('*', true)).toBe(true);
			expect(context.canEnterFormatting('_', false)).toBe(true);
		});

		test('should prevent entering active formatting', () => {
			context.pushFormatting('*', true);
			expect(context.canEnterFormatting('*', true)).toBe(false);
			expect(context.canEnterFormatting('*', false)).toBe(true);
		});

		test('should handle underscore special cases', () => {
			context.setCurrentText('test_with_underscores');
			context.pushFormatting('_', false);
			expect(context.canEnterFormatting('_', true)).toBe(true);
		});
	});

	describe('setCurrentText', () => {
		test('should detect underscores in text', () => {
			context.setCurrentText('test_with_underscores');
			context.pushFormatting('_', false);
			expect(context.canEnterFormatting('_', true)).toBe(true);
		});

		test('should handle text without underscores', () => {
			context.setCurrentText('test without underscores');
			expect(context.canEnterFormatting('_', true)).toBe(true);
		});
	});
});
