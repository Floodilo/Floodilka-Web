/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';
import type {GuildEmojiWithUser} from '~/records/GuildEmojiRecord';

const logger = new Logger('Emojis');

export const sanitizeEmojiName = (fileName: string): string => {
	const name =
		fileName
			.split('.')
			.shift()
			?.replace(/[^a-zA-Z0-9_]/g, '') ?? '';
	return name.padEnd(2, '_').slice(0, 32);
};

export const list = async (guildId: string): Promise<ReadonlyArray<GuildEmojiWithUser>> => {
	try {
		const response = await http.get<ReadonlyArray<GuildEmojiWithUser>>({url: Endpoints.GUILD_EMOJIS(guildId)});
		const emojis = response.body;
		logger.debug(`Retrieved ${emojis.length} emojis for guild ${guildId}`);
		return emojis;
	} catch (error) {
		logger.error(`Failed to list emojis for guild ${guildId}:`, error);
		throw error;
	}
};

export const bulkUpload = async (
	guildId: string,
	emojis: Array<{name: string; image: string}>,
	signal?: AbortSignal,
): Promise<{success: Array<any>; failed: Array<{name: string; error: string}>}> => {
	try {
		const response = await http.post<{success: Array<any>; failed: Array<{name: string; error: string}>}>({
			url: `${Endpoints.GUILD_EMOJIS(guildId)}/bulk`,
			body: {emojis},
			signal,
		});
		const result = response.body;
		logger.debug(`Bulk uploaded ${result.success.length} emojis to guild ${guildId}, ${result.failed.length} failed`);
		return result;
	} catch (error) {
		logger.error(`Failed to bulk upload emojis to guild ${guildId}:`, error);
		throw error;
	}
};

export const update = async (guildId: string, emojiId: string, data: {name: string}): Promise<void> => {
	try {
		await http.patch({url: Endpoints.GUILD_EMOJI(guildId, emojiId), body: data});
		logger.debug(`Updated emoji ${emojiId} in guild ${guildId}`);
	} catch (error) {
		logger.error(`Failed to update emoji ${emojiId} in guild ${guildId}:`, error);
		throw error;
	}
};

export const remove = async (guildId: string, emojiId: string, purge = false): Promise<void> => {
	try {
		const query = purge ? '?purge=true' : '';
		await http.delete({url: `${Endpoints.GUILD_EMOJI(guildId, emojiId)}${query}`});
		logger.debug(`Removed emoji ${emojiId} from guild ${guildId}`);
	} catch (error) {
		logger.error(`Failed to remove emoji ${emojiId} from guild ${guildId}:`, error);
		throw error;
	}
};
