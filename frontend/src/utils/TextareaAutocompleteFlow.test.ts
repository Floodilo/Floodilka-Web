/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {beforeEach, describe, expect, it} from 'vitest';
import {TextareaSegmentManager} from './TextareaSegmentManager';

describe('Textarea Autocomplete Flow Integration', () => {
	let manager: TextareaSegmentManager;

	beforeEach(() => {
		manager = new TextareaSegmentManager();
	});

	function simulateAutocompleteSelect(
		currentValue: string,
		matchStart: number,
		matchEnd: number,
		displayText: string,
		actualText: string,
		segmentType: 'user' | 'role' | 'channel' | 'emoji' | 'special',
		segmentId: string,
		capturedWhitespace = '',
	): string {
		const hasLeadingSpace = capturedWhitespace.length > 0;
		const beforeMatch = currentValue.slice(0, matchStart + capturedWhitespace.length);
		const afterMatch = currentValue.slice(matchEnd);

		const guildBeforeMatch = hasLeadingSpace || beforeMatch.endsWith(' ') || beforeMatch.length === 0 ? '' : ' ';
		const insertPosition = beforeMatch.length + guildBeforeMatch.length;

		const changeStart = beforeMatch.length;
		const changeEnd = matchEnd;
		manager.updateSegmentsForTextChange(changeStart, changeEnd, guildBeforeMatch.length);

		const tempText = `${beforeMatch}${guildBeforeMatch}`;
		const {newText: updatedText} = manager.insertSegment(
			tempText,
			insertPosition,
			`${displayText} `,
			`${actualText} `,
			segmentType,
			segmentId,
		);

		const finalText = updatedText + afterMatch;
		const trimmed = finalText.trimStart();

		return trimmed;
	}

	it('should handle first mention autocomplete', () => {
		const value = '@Player';
		const matchStart = 0;
		const matchEnd = 7;

		const result = simulateAutocompleteSelect(value, matchStart, matchEnd, '@Player#0001', '<@123>', 'user', '123');

		expect(result).toBe('@Player#0001 ');
		expect(manager.getSegments()).toHaveLength(1);
		expect(manager.displayToActual(result)).toBe('<@123> ');
	});

	it('should handle second consecutive mention - the failing case', () => {
		let value = '@Player';
		let result = simulateAutocompleteSelect(value, 0, 7, '@Player#0001', '<@123>', 'user', '123');
		expect(result).toBe('@Player#0001 ');
		expect(manager.getSegments()).toHaveLength(1);

		value = `${result}@Player`;
		const matchStart = result.length;
		const matchEnd = value.length;

		result = simulateAutocompleteSelect(value, matchStart, matchEnd, '@Player#0001', '<@123>', 'user', '123');

		expect(result).toBe('@Player#0001 @Player#0001 ');
		const segments = manager.getSegments();
		expect(segments).toHaveLength(2);
		expect(manager.displayToActual(result)).toBe('<@123> <@123> ');
	});

	it('should handle three consecutive mentions', () => {
		let value = '@Player';
		let prevLength = 0;
		let result = simulateAutocompleteSelect(value, 0, 7, '@Player#0001', '<@123>', 'user', '123');

		prevLength = result.length;
		value = `${result}@Player`;
		result = simulateAutocompleteSelect(value, prevLength, value.length, '@Player#0001', '<@123>', 'user', '123');

		prevLength = result.length;
		value = `${result}@Player`;
		result = simulateAutocompleteSelect(value, prevLength, value.length, '@Player#0001', '<@123>', 'user', '123');

		expect(result).toBe('@Player#0001 @Player#0001 @Player#0001 ');
		const segments = manager.getSegments();
		expect(segments).toHaveLength(3);
		expect(manager.displayToActual(result)).toBe('<@123> <@123> <@123> ');
	});

	it('should handle mention with text before it', () => {
		const value = 'Hey @User';
		const matchStart = 4;
		const matchEnd = 9;

		const result = simulateAutocompleteSelect(value, matchStart, matchEnd, '@User#0001', '<@123>', 'user', '123');

		expect(result).toBe('Hey @User#0001 ');
		expect(manager.getSegments()).toHaveLength(1);
		expect(manager.displayToActual(result)).toBe('Hey <@123> ');
	});

	it('should handle multiple mentions with text between them', () => {
		let value = 'Hey @User1';
		let result = simulateAutocompleteSelect(value, 4, 10, '@User1#0001', '<@123>', 'user', '123');

		value = `${result}and @User2`;
		result = simulateAutocompleteSelect(value, result.length + 4, value.length, '@User2#0002', '<@456>', 'user', '456');

		expect(result).toBe('Hey @User1#0001 and @User2#0002 ');
		const segments = manager.getSegments();
		expect(segments).toHaveLength(2);
		expect(manager.displayToActual(result)).toBe('Hey <@123> and <@456> ');
	});

	it('should handle consecutive mentions', () => {
		let value = '@H';
		let result = simulateAutocompleteSelect(value, 0, 2, '@Player#0001', '<@123>', 'user', '123');

		const prevLength = result.length;
		value = `${result}@H`;

		result = simulateAutocompleteSelect(value, prevLength, value.length, '@Player#0001', '<@123>', 'user', '123');

		expect(result).toBe('@Player#0001 @Player#0001 ');
		const segments = manager.getSegments();
		expect(segments).toHaveLength(2);
		expect(segments[0]).toMatchObject({id: '123', start: 0, end: 13});
		expect(segments[1]).toMatchObject({id: '123', start: 13, end: 26});
		expect(manager.displayToActual(result)).toBe('<@123> <@123> ');
	});

	it('should handle typing between autocompletes with handleTextChange', () => {
		let previousValue = '';
		let value = '@H';

		value = simulateAutocompleteSelect(value, 0, 2, '@Player#0001', '<@123>', 'user', '123');
		previousValue = value;

		expect(value).toBe('@Player#0001 ');
		expect(manager.getSegments()).toHaveLength(1);

		const newValue = `${value}@`;
		const change = TextareaSegmentManager.detectChange(previousValue, newValue);
		manager.updateSegmentsForTextChange(change.changeStart, change.changeEnd, change.replacementLength);
		value = newValue;
		previousValue = value;

		expect(manager.getSegments()).toHaveLength(1);
		expect(manager.getSegments()[0]).toMatchObject({id: '123', start: 0, end: 13});

		const newValue2 = `${value}H`;
		const change2 = TextareaSegmentManager.detectChange(previousValue, newValue2);
		manager.updateSegmentsForTextChange(change2.changeStart, change2.changeEnd, change2.replacementLength);
		value = newValue2;
		previousValue = value;

		expect(manager.getSegments()).toHaveLength(1);

		const matchStart = '@Player#0001 '.length;
		const matchEnd = value.length;
		value = simulateAutocompleteSelect(value, matchStart, matchEnd, '@Player#0001', '<@123>', 'user', '123');

		expect(value).toBe('@Player#0001 @Player#0001 ');
		expect(manager.getSegments()).toHaveLength(2);
		expect(manager.displayToActual(value)).toBe('<@123> <@123> ');
	});

	it('should reproduce and fix the bug - regex match includes space', () => {
		const MENTION_REGEX = /(^|\s)@(\S*)$/;

		let value = '@Player#0001 ';
		manager.insertSegment('', 0, '@Player#0001 ', '<@123> ', 'user', '123');

		value += '@H';

		const valueUpToCursor = value;
		const match = valueUpToCursor.match(MENTION_REGEX);

		if (match) {
			const matchStart = match.index ?? 0;
			const matchEnd = matchStart + match[0].length;
			const capturedWhitespace = match[1] || '';

			const result = simulateAutocompleteSelect(
				value,
				matchStart,
				matchEnd,
				'@Player#0001',
				'<@123>',
				'user',
				'123',
				capturedWhitespace,
			);

			expect(manager.getSegments()).toHaveLength(2);
			expect(manager.displayToActual(result)).toBe('<@123> <@123> ');
		}
	});
});
