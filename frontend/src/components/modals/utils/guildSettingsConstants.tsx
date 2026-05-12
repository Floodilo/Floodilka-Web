/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageDescriptor} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import {
	BookOpenIcon,
	GearIcon,
	HammerIcon,
	type Icon,
	type IconWeight,
	LinkIcon,
	ProhibitIcon,
	ShieldIcon,
	SmileyIcon,
	StickerIcon,
	TicketIcon,
	UserIcon,
	WebhooksLogoIcon,
} from '@phosphor-icons/react';
import type React from 'react';
import {GuildFeatures, Permissions} from '~/Constants';
import GuildAuditLogTab from '../guildTabs/GuildAuditLogTab';
import GuildBansTab from '../guildTabs/GuildBansTab';
import GuildEmojiTab from '../guildTabs/GuildEmojiTab';
import GuildInvitesTab from '../guildTabs/GuildInvitesTab';
import GuildMembersTab from '../guildTabs/GuildMembersTab';
import GuildModerationTab from '../guildTabs/GuildModerationTab';
import GuildOverviewTab from '../guildTabs/GuildOverviewTab';
import GuildRolesTab from '../guildTabs/GuildRolesTab';
import GuildStickersTab from '../guildTabs/GuildStickersTab';
import GuildVanityURLTab from '../guildTabs/GuildVanityURLTab';
import GuildWebhooksTab from '../guildTabs/GuildWebhooksTab';

export type GuildSettingsTabType =
	| 'overview'
	| 'roles'
	| 'emoji'
	| 'stickers'
	| 'moderation'
	| 'audit_log'
	| 'webhooks'
	| 'vanity_url'
	| 'members'
	| 'invites'
	| 'bans';
type GuildSettingsTabCategories = 'guild_settings' | 'user_management';

export interface GuildSettingsTab {
	type: GuildSettingsTabType;
	category: GuildSettingsTabCategories;
	label: string;
	icon: Icon;
	iconWeight?: IconWeight;
	component: React.ComponentType<{guildId: string}>;
	permission?: bigint;
	requireFeature?: string;
}

interface GuildSettingsTabDescriptor {
	type: GuildSettingsTabType;
	category: GuildSettingsTabCategories;
	label: MessageDescriptor;
	icon: Icon;
	iconWeight?: IconWeight;
	component: React.ComponentType<{guildId: string}>;
	permission?: bigint;
	requireFeature?: string;
}

const GUILD_SETTINGS_TABS_DESCRIPTORS: Array<GuildSettingsTabDescriptor> = [
	{
		type: 'overview',
		category: 'guild_settings',
		label: msg`General`,
		icon: GearIcon,
		component: GuildOverviewTab,
		permission: Permissions.MANAGE_GUILD,
	},
	{
		type: 'roles',
		category: 'guild_settings',
		label: msg`Roles & Permissions`,
		icon: ShieldIcon,
		component: GuildRolesTab,
		permission: Permissions.MANAGE_ROLES,
	},
	{
		type: 'emoji',
		category: 'guild_settings',
		label: msg`Custom Emoji`,
		icon: SmileyIcon,
		component: GuildEmojiTab,
		permission: Permissions.MANAGE_EXPRESSIONS,
	},
	{
		type: 'stickers',
		category: 'guild_settings',
		label: msg`Custom Stickers`,
		icon: StickerIcon,
		component: GuildStickersTab,
		permission: Permissions.MANAGE_EXPRESSIONS,
	},
	{
		type: 'moderation',
		category: 'guild_settings',
		label: msg`Safety & Moderation`,
		icon: HammerIcon,
		component: GuildModerationTab,
		permission: Permissions.MANAGE_GUILD,
	},
	{
		type: 'audit_log',
		category: 'guild_settings',
		label: msg`Activity Log`,
		icon: BookOpenIcon,
		component: GuildAuditLogTab,
		permission: Permissions.VIEW_AUDIT_LOG,
	},
	{
		type: 'webhooks',
		category: 'guild_settings',
		label: msg`Webhooks`,
		icon: WebhooksLogoIcon,
		component: GuildWebhooksTab,
		permission: Permissions.MANAGE_WEBHOOKS,
	},
	{
		type: 'vanity_url',
		category: 'guild_settings',
		label: msg`Custom Invite URL`,
		icon: LinkIcon,
		iconWeight: 'bold',
		component: GuildVanityURLTab,
		permission: Permissions.MANAGE_GUILD,
		requireFeature: GuildFeatures.VANITY_URL,
	},
	{
		type: 'members',
		category: 'user_management',
		label: msg`Members`,
		icon: UserIcon,
		component: GuildMembersTab,
		permission: Permissions.MANAGE_GUILD,
	},
	{
		type: 'invites',
		category: 'user_management',
		label: msg`Invite Links`,
		icon: TicketIcon,
		component: GuildInvitesTab,
		permission: Permissions.MANAGE_GUILD,
	},
	{
		type: 'bans',
		category: 'user_management',
		label: msg`Bans`,
		icon: ProhibitIcon,
		component: GuildBansTab,
		permission: Permissions.BAN_MEMBERS,
	},
];

export const getGuildSettingsTabs = (t: (msg: MessageDescriptor) => string): Array<GuildSettingsTab> => {
	return GUILD_SETTINGS_TABS_DESCRIPTORS.map((tab) => ({
		...tab,
		label: t(tab.label),
	}));
};
