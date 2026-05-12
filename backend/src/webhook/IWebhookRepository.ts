/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Webhook} from '~/Models';

export abstract class IWebhookRepository {
	abstract findUnique(webhookId: bigint): Promise<Webhook | null>;
	abstract findByToken(webhookId: bigint, token: string): Promise<Webhook | null>;
	abstract create(data: {
		webhookId: bigint;
		token: string;
		type: number;
		guildId: bigint | null;
		channelId: bigint | null;
		creatorId: bigint | null;
		name: string;
		avatarHash: string | null;
	}): Promise<Webhook>;
	abstract update(
		webhookId: bigint,
		data: Partial<{
			token: string;
			type: number;
			guildId: bigint | null;
			channelId: bigint | null;
			creatorId: bigint | null;
			name: string;
			avatarHash: string | null;
		}>,
	): Promise<Webhook | null>;
	abstract delete(webhookId: bigint): Promise<void>;
	abstract listByGuild(guildId: bigint): Promise<Array<Webhook>>;
	abstract listByChannel(channelId: bigint): Promise<Array<Webhook>>;
	abstract countByGuild(guildId: bigint): Promise<number>;
	abstract countByChannel(channelId: bigint): Promise<number>;
}
