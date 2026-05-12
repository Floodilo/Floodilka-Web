/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const LOG_PAGE_SIZE = 50;
export const DEFAULT_FOR_STRINGS_KEY = '__DEFAULT__';

export enum AuditLogTargetType {
	ALL = 'all',
	GUILD = 'guild',
	CHANNEL = 'channel',
	USER = 'user',
	ROLE = 'role',
	INVITE = 'invite',
	WEBHOOK = 'webhook',
	EMOJI = 'emoji',
	STICKER = 'sticker',
	MESSAGE = 'message',
}

export enum AuditLogActionKind {
	CREATE = 'create',
	UPDATE = 'update',
	DELETE = 'delete',
}
