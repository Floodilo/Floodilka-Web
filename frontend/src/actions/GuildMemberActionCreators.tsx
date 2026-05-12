/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';
import type {GuildMember} from '~/records/GuildMemberRecord';

const logger = new Logger('GuildMembers');

export const update = async (
	guildId: string,
	userId: string,
	params: Partial<GuildMember> & {channel_id?: string | null; connection_id?: string},
): Promise<void> => {
	try {
		await http.patch({url: Endpoints.GUILD_MEMBER(guildId, userId), body: params});
		logger.debug(`Updated member ${userId} in guild ${guildId}`, {connection_id: params.connection_id});
	} catch (error) {
		logger.error(`Failed to update member ${userId} in guild ${guildId}:`, error);
		throw error;
	}
};

export const addRole = async (guildId: string, userId: string, roleId: string): Promise<void> => {
	try {
		await http.put({url: Endpoints.GUILD_MEMBER_ROLE(guildId, userId, roleId)});
		logger.debug(`Added role ${roleId} to member ${userId} in guild ${guildId}`);
	} catch (error) {
		logger.error(`Failed to add role ${roleId} to member ${userId} in guild ${guildId}:`, error);
		throw error;
	}
};

export const removeRole = async (guildId: string, userId: string, roleId: string): Promise<void> => {
	try {
		await http.delete({url: Endpoints.GUILD_MEMBER_ROLE(guildId, userId, roleId)});
		logger.debug(`Removed role ${roleId} from member ${userId} in guild ${guildId}`);
	} catch (error) {
		logger.error(`Failed to remove role ${roleId} from member ${userId} in guild ${guildId}:`, error);
		throw error;
	}
};

export const updateProfile = async (
	guildId: string,
	params: {
		avatar?: string | null;
		banner?: string | null;
		bio?: string | null;
		nick?: string | null;
		profile_flags?: number | null;
	},
): Promise<void> => {
	try {
		await http.patch({url: Endpoints.GUILD_MEMBER(guildId), body: params});
		logger.debug(`Updated current user's per-guild profile in guild ${guildId}`);
	} catch (error) {
		logger.error(`Failed to update current user's per-guild profile in guild ${guildId}:`, error);
		throw error;
	}
};

export const kick = async (guildId: string, userId: string): Promise<void> => {
	try {
		await http.delete({url: Endpoints.GUILD_MEMBER(guildId, userId)});
		logger.debug(`Kicked member ${userId} from guild ${guildId}`);
	} catch (error) {
		logger.error(`Failed to kick member ${userId} from guild ${guildId}:`, error);
		throw error;
	}
};

export const timeout = async (
	guildId: string,
	userId: string,
	communicationDisabledUntil: string | null,
	timeoutReason?: string | null,
): Promise<void> => {
	try {
		const body: Record<string, string | null> = {
			communication_disabled_until: communicationDisabledUntil,
		};
		if (timeoutReason) {
			body.timeout_reason = timeoutReason;
		}
		await http.patch({
			url: Endpoints.GUILD_MEMBER(guildId, userId),
			body,
		});
		logger.debug(`Updated timeout for member ${userId} in guild ${guildId}`);
	} catch (error) {
		logger.error(`Failed to update timeout for member ${userId} in guild ${guildId}:`, error);
		throw error;
	}
};
