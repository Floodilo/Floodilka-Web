/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {I18n} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import {ChannelTypes} from '~/Constants';
import type {ChannelRecord} from '~/records/ChannelRecord';
import type {MessageSearchScope, SearchValueOption} from '~/utils/SearchUtils';

export interface ScopeValueOption extends SearchValueOption {
	value: MessageSearchScope;
}

export const DEFAULT_SCOPE_VALUE: MessageSearchScope = 'current';

export const getScopeOptionsForChannel = (i18n: I18n, channel?: ChannelRecord | null): Array<ScopeValueOption> => {
	const DM_SCOPE_OPTIONS: Array<ScopeValueOption> = [
		{
			value: 'current',
			label: i18n._(msg`Current DM`),
			isDefault: true,
			description: i18n._(msg`Search only in the current DM`),
		},
		{
			value: 'all_dms',
			label: i18n._(msg`All DMs`),
			description: i18n._(msg`Across all DMs you've ever been in`),
		},
		{
			value: 'open_dms',
			label: i18n._(msg`Open DMs`),
			description: i18n._(msg`Across all DMs you currently have open`),
		},
		{
			value: 'all',
			label: i18n._(msg`All DMs + Communities`),
			description: i18n._(msg`Across all DMs you've ever been in + all Communities you're currently in`),
		},
		{
			value: 'open_dms_and_all_guilds',
			label: i18n._(msg`Open DMs + Communities`),
			description: i18n._(msg`Across all DMs you currently have open + all Communities you're currently in`),
		},
	];

	const GUILD_SCOPE_OPTIONS: Array<ScopeValueOption> = [
		{
			value: 'current',
			label: i18n._(msg`Current Community`),
			isDefault: true,
			description: i18n._(msg`Search only in the current Community`),
		},
		{
			value: 'all_guilds',
			label: i18n._(msg`All Communities`),
			description: i18n._(msg`Across all Communities you're currently in`),
		},
		{
			value: 'all_dms',
			label: i18n._(msg`All DMs Only`),
			description: i18n._(msg`Across all DMs you've ever been in only`),
		},
		{
			value: 'open_dms',
			label: i18n._(msg`Open DMs Only`),
			description: i18n._(msg`Across all DMs you currently have open only`),
		},
		{
			value: 'all',
			label: i18n._(msg`All DMs + Communities`),
			description: i18n._(msg`Across all DMs you've ever been in + all Communities you're currently in`),
		},
		{
			value: 'open_dms_and_all_guilds',
			label: i18n._(msg`Open DMs + Communities`),
			description: i18n._(msg`Across all DMs you currently have open + all Communities you're currently in`),
		},
	];

	if (!channel) {
		return GUILD_SCOPE_OPTIONS;
	}

	const isDmChannel =
		channel.type === ChannelTypes.DM ||
		channel.type === ChannelTypes.GROUP_DM ||
		channel.type === ChannelTypes.DM_PERSONAL_NOTES;
	return isDmChannel ? DM_SCOPE_OPTIONS : GUILD_SCOPE_OPTIONS;
};
