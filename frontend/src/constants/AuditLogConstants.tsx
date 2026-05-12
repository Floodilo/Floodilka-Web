/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {I18n, MessageDescriptor} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import {AuditLogActionType} from './AuditLogActionType';

export const AUDIT_LOG_TARGET_TYPES = {
	GUILD: 'guild',
	MEMBER: 'member',
	ROLE: 'role',
	CHANNEL: 'channel',
	EMOJI: 'emoji',
	STICKER: 'sticker',
	INVITE: 'invite',
	WEBHOOK: 'webhook',
} as const;

export type AuditLogTargetType = (typeof AUDIT_LOG_TARGET_TYPES)[keyof typeof AUDIT_LOG_TARGET_TYPES];

export interface AuditLogActionDefinition {
	value: AuditLogActionType;
	label: MessageDescriptor;
	targetType: AuditLogTargetType;
}

export const AUDIT_LOG_ACTIONS: ReadonlyArray<AuditLogActionDefinition> = [
	{
		value: AuditLogActionType.GUILD_UPDATE,
		label: msg`Community Updated`,
		targetType: AUDIT_LOG_TARGET_TYPES.GUILD,
	},
	{
		value: AuditLogActionType.CHANNEL_CREATE,
		label: msg`Channel Created`,
		targetType: AUDIT_LOG_TARGET_TYPES.CHANNEL,
	},
	{
		value: AuditLogActionType.CHANNEL_UPDATE,
		label: msg`Channel Updated`,
		targetType: AUDIT_LOG_TARGET_TYPES.CHANNEL,
	},
	{
		value: AuditLogActionType.CHANNEL_DELETE,
		label: msg`Channel Deleted`,
		targetType: AUDIT_LOG_TARGET_TYPES.CHANNEL,
	},
	{
		value: AuditLogActionType.CHANNEL_OVERWRITE_CREATE,
		label: msg`Channel Overwrite Added`,
		targetType: AUDIT_LOG_TARGET_TYPES.CHANNEL,
	},
	{
		value: AuditLogActionType.CHANNEL_OVERWRITE_UPDATE,
		label: msg`Channel Overwrite Updated`,
		targetType: AUDIT_LOG_TARGET_TYPES.CHANNEL,
	},
	{
		value: AuditLogActionType.CHANNEL_OVERWRITE_DELETE,
		label: msg`Channel Overwrite Removed`,
		targetType: AUDIT_LOG_TARGET_TYPES.CHANNEL,
	},
	{
		value: AuditLogActionType.MEMBER_KICK,
		label: msg`Member Kicked`,
		targetType: AUDIT_LOG_TARGET_TYPES.MEMBER,
	},
	{
		value: AuditLogActionType.MEMBER_PRUNE,
		label: msg`Members Pruned`,
		targetType: AUDIT_LOG_TARGET_TYPES.MEMBER,
	},
	{
		value: AuditLogActionType.MEMBER_BAN_ADD,
		label: msg`Member Banned`,
		targetType: AUDIT_LOG_TARGET_TYPES.MEMBER,
	},
	{
		value: AuditLogActionType.MEMBER_BAN_REMOVE,
		label: msg`Member Unbanned`,
		targetType: AUDIT_LOG_TARGET_TYPES.MEMBER,
	},
	{
		value: AuditLogActionType.MEMBER_UPDATE,
		label: msg`Member Updated`,
		targetType: AUDIT_LOG_TARGET_TYPES.MEMBER,
	},
	{
		value: AuditLogActionType.MEMBER_ROLE_UPDATE,
		label: msg`Member Roles Updated`,
		targetType: AUDIT_LOG_TARGET_TYPES.MEMBER,
	},
	{
		value: AuditLogActionType.MEMBER_MOVE,
		label: msg`Member Moved`,
		targetType: AUDIT_LOG_TARGET_TYPES.MEMBER,
	},
	{
		value: AuditLogActionType.MEMBER_DISCONNECT,
		label: msg`Member Disconnected`,
		targetType: AUDIT_LOG_TARGET_TYPES.MEMBER,
	},
	{
		value: AuditLogActionType.BOT_ADD,
		label: msg`Bot Added`,
		targetType: AUDIT_LOG_TARGET_TYPES.MEMBER,
	},
	{
		value: AuditLogActionType.ROLE_CREATE,
		label: msg`Role Created`,
		targetType: AUDIT_LOG_TARGET_TYPES.ROLE,
	},
	{
		value: AuditLogActionType.ROLE_UPDATE,
		label: msg`Role Updated`,
		targetType: AUDIT_LOG_TARGET_TYPES.ROLE,
	},
	{
		value: AuditLogActionType.ROLE_DELETE,
		label: msg`Role Deleted`,
		targetType: AUDIT_LOG_TARGET_TYPES.ROLE,
	},
	{
		value: AuditLogActionType.INVITE_CREATE,
		label: msg`Invite Created`,
		targetType: AUDIT_LOG_TARGET_TYPES.INVITE,
	},
	{
		value: AuditLogActionType.INVITE_UPDATE,
		label: msg`Invite Updated`,
		targetType: AUDIT_LOG_TARGET_TYPES.INVITE,
	},
	{
		value: AuditLogActionType.INVITE_DELETE,
		label: msg`Invite Deleted`,
		targetType: AUDIT_LOG_TARGET_TYPES.INVITE,
	},
	{
		value: AuditLogActionType.WEBHOOK_CREATE,
		label: msg`Webhook Created`,
		targetType: AUDIT_LOG_TARGET_TYPES.WEBHOOK,
	},
	{
		value: AuditLogActionType.WEBHOOK_UPDATE,
		label: msg`Webhook Updated`,
		targetType: AUDIT_LOG_TARGET_TYPES.WEBHOOK,
	},
	{
		value: AuditLogActionType.WEBHOOK_DELETE,
		label: msg`Webhook Deleted`,
		targetType: AUDIT_LOG_TARGET_TYPES.WEBHOOK,
	},
	{
		value: AuditLogActionType.EMOJI_CREATE,
		label: msg`Emoji Created`,
		targetType: AUDIT_LOG_TARGET_TYPES.EMOJI,
	},
	{
		value: AuditLogActionType.EMOJI_UPDATE,
		label: msg`Emoji Updated`,
		targetType: AUDIT_LOG_TARGET_TYPES.EMOJI,
	},
	{
		value: AuditLogActionType.EMOJI_DELETE,
		label: msg`Emoji Deleted`,
		targetType: AUDIT_LOG_TARGET_TYPES.EMOJI,
	},
	{
		value: AuditLogActionType.STICKER_CREATE,
		label: msg`Sticker Created`,
		targetType: AUDIT_LOG_TARGET_TYPES.STICKER,
	},
	{
		value: AuditLogActionType.STICKER_UPDATE,
		label: msg`Sticker Updated`,
		targetType: AUDIT_LOG_TARGET_TYPES.STICKER,
	},
	{
		value: AuditLogActionType.STICKER_DELETE,
		label: msg`Sticker Deleted`,
		targetType: AUDIT_LOG_TARGET_TYPES.STICKER,
	},
	{
		value: AuditLogActionType.MESSAGE_DELETE,
		label: msg`Message Deleted`,
		targetType: AUDIT_LOG_TARGET_TYPES.CHANNEL,
	},
	{
		value: AuditLogActionType.MESSAGE_BULK_DELETE,
		label: msg`Messages Deleted`,
		targetType: AUDIT_LOG_TARGET_TYPES.CHANNEL,
	},
	{
		value: AuditLogActionType.MESSAGE_PIN,
		label: msg`Message Pinned`,
		targetType: AUDIT_LOG_TARGET_TYPES.CHANNEL,
	},
	{
		value: AuditLogActionType.MESSAGE_UNPIN,
		label: msg`Message Unpinned`,
		targetType: AUDIT_LOG_TARGET_TYPES.CHANNEL,
	},
];

export function getTranslatedAuditLogActions(i18n: I18n): Array<{
	value: AuditLogActionType;
	label: string;
	targetType: AuditLogTargetType;
}> {
	return AUDIT_LOG_ACTIONS.map((action) => ({
		...action,
		label: i18n._(action.label),
	}));
}

export const AUDIT_LOG_TARGET_LABELS: Record<AuditLogTargetType, MessageDescriptor> = {
	[AUDIT_LOG_TARGET_TYPES.GUILD]: msg`Community`,
	[AUDIT_LOG_TARGET_TYPES.MEMBER]: msg`Member`,
	[AUDIT_LOG_TARGET_TYPES.ROLE]: msg`Role`,
	[AUDIT_LOG_TARGET_TYPES.CHANNEL]: msg`Channel`,
	[AUDIT_LOG_TARGET_TYPES.EMOJI]: msg`Emoji`,
	[AUDIT_LOG_TARGET_TYPES.STICKER]: msg`Sticker`,
	[AUDIT_LOG_TARGET_TYPES.INVITE]: msg`Invite`,
	[AUDIT_LOG_TARGET_TYPES.WEBHOOK]: msg`Webhook`,
};

export function getTranslatedAuditLogTargetLabels(i18n: I18n): Record<AuditLogTargetType, string> {
	const translatedLabels: Record<AuditLogTargetType, string> = {} as Record<AuditLogTargetType, string>;

	for (const [key, descriptor] of Object.entries(AUDIT_LOG_TARGET_LABELS)) {
		translatedLabels[key as AuditLogTargetType] = i18n._(descriptor);
	}

	return translatedLabels;
}
