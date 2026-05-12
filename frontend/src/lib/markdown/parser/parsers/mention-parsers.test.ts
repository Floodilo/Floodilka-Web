/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {describe, expect, test} from 'vitest';
import {Parser} from '../parser/parser';
import {GuildNavKind, MentionKind, NodeType, ParserFlags} from '../types/enums';

describe('Floodilka Markdown Parser', () => {
	test('user mentions', () => {
		const input = 'Hello <@1234567890> and <@!9876543210>';
		const flags = ParserFlags.ALLOW_USER_MENTIONS;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([
			{type: NodeType.Text, content: 'Hello '},
			{type: NodeType.Mention, kind: {kind: MentionKind.User, id: '1234567890'}},
			{type: NodeType.Text, content: ' and '},
			{type: NodeType.Mention, kind: {kind: MentionKind.User, id: '9876543210'}},
		]);
	});

	test('channel mention', () => {
		const input = 'Please check <#103735883630395392>';
		const flags = ParserFlags.ALLOW_CHANNEL_MENTIONS;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([
			{type: NodeType.Text, content: 'Please check '},
			{type: NodeType.Mention, kind: {kind: MentionKind.Channel, id: '103735883630395392'}},
		]);
	});

	test('role mention', () => {
		const input = 'This is for <@&165511591545143296>';
		const flags = ParserFlags.ALLOW_ROLE_MENTIONS;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([
			{type: NodeType.Text, content: 'This is for '},
			{type: NodeType.Mention, kind: {kind: MentionKind.Role, id: '165511591545143296'}},
		]);
	});

	test('slash command mention', () => {
		const input = 'Use </airhorn:816437322781949972>';
		const flags = ParserFlags.ALLOW_COMMAND_MENTIONS;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([
			{type: NodeType.Text, content: 'Use '},
			{
				type: NodeType.Mention,
				kind: {
					kind: MentionKind.Command,
					name: 'airhorn',
					subcommandGroup: undefined,
					subcommand: undefined,
					id: '816437322781949972',
				},
			},
		]);
	});

	test('slash command with subcommands', () => {
		const input = 'Try </app group sub:1234567890>';
		const flags = ParserFlags.ALLOW_COMMAND_MENTIONS;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([
			{type: NodeType.Text, content: 'Try '},
			{
				type: NodeType.Mention,
				kind: {
					kind: MentionKind.Command,
					name: 'app',
					subcommandGroup: 'group',
					subcommand: 'sub',
					id: '1234567890',
				},
			},
		]);
	});

	test('guild nav customize', () => {
		const input = 'Go to <id:customize> now!';
		const flags = ParserFlags.ALLOW_GUILD_NAVIGATIONS;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([
			{type: NodeType.Text, content: 'Go to '},
			{type: NodeType.Mention, kind: {kind: MentionKind.GuildNavigation, navigationType: GuildNavKind.Customize}},
			{type: NodeType.Text, content: ' now!'},
		]);
	});

	test('guild nav linked roles', () => {
		const input = 'Check <id:linked-roles:123456> settings';
		const flags = ParserFlags.ALLOW_GUILD_NAVIGATIONS;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([
			{type: NodeType.Text, content: 'Check '},
			{
				type: NodeType.Mention,
				kind: {
					kind: MentionKind.GuildNavigation,
					navigationType: GuildNavKind.LinkedRoles,
					id: '123456',
				},
			},
			{type: NodeType.Text, content: ' settings'},
		]);
	});

	test('invalid guild nav', () => {
		const input = 'Invalid <12345:customize>';
		const flags = ParserFlags.ALLOW_GUILD_NAVIGATIONS;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([{type: NodeType.Text, content: 'Invalid <12345:customize>'}]);
	});

	test('everyone and here mentions', () => {
		const input = '@everyone and @here are both important.';
		const flags = ParserFlags.ALLOW_EVERYONE_MENTIONS;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([
			{type: NodeType.Mention, kind: {kind: MentionKind.Everyone}},
			{type: NodeType.Text, content: ' and '},
			{type: NodeType.Mention, kind: {kind: MentionKind.Here}},
			{type: NodeType.Text, content: ' are both important.'},
		]);
	});

	test('escaped everyone and here mentions', () => {
		const input = '\\@everyone and \\@here should not be parsed.';
		const flags = ParserFlags.ALLOW_EVERYONE_MENTIONS;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([{type: NodeType.Text, content: '@everyone and @here should not be parsed.'}]);
	});

	test('mentions inside inline code', () => {
		const input = '`@everyone` and `@here` should remain unchanged.';
		const flags = ParserFlags.ALLOW_EVERYONE_MENTIONS;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([
			{type: NodeType.InlineCode, content: '@everyone'},
			{type: NodeType.Text, content: ' and '},
			{type: NodeType.InlineCode, content: '@here'},
			{type: NodeType.Text, content: ' should remain unchanged.'},
		]);
	});

	test('mentions inside code block', () => {
		const input = '```\n@everyone\n@here\n```';
		const flags = ParserFlags.ALLOW_EVERYONE_MENTIONS | ParserFlags.ALLOW_CODE_BLOCKS;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([
			{
				type: NodeType.CodeBlock,
				language: undefined,
				content: '@everyone\n@here\n',
			},
		]);
	});

	test('mentions with flags disabled', () => {
		const input = '@everyone and @here should not be parsed.';
		const flags = 0;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([{type: NodeType.Text, content: '@everyone and @here should not be parsed.'}]);
	});

	test('mentions followed by punctuation', () => {
		const input = 'Hello @everyone! Are you there, @here?';
		const flags = ParserFlags.ALLOW_EVERYONE_MENTIONS;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([
			{type: NodeType.Text, content: 'Hello '},
			{type: NodeType.Mention, kind: {kind: MentionKind.Everyone}},
			{type: NodeType.Text, content: '! Are you there, '},
			{type: NodeType.Mention, kind: {kind: MentionKind.Here}},
			{type: NodeType.Text, content: '?'},
		]);
	});

	test('mentions adjacent to other symbols', () => {
		const input = 'Check this out:@everyone@here!';
		const flags = ParserFlags.ALLOW_EVERYONE_MENTIONS;
		const parser = new Parser(input, flags);
		const {nodes: ast} = parser.parse();

		expect(ast).toEqual([
			{type: NodeType.Text, content: 'Check this out:'},
			{type: NodeType.Mention, kind: {kind: MentionKind.Everyone}},
			{type: NodeType.Mention, kind: {kind: MentionKind.Here}},
			{type: NodeType.Text, content: '!'},
		]);
	});
});
