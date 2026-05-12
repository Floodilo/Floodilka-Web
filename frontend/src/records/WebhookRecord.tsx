/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserPartial, UserRecord} from '~/records/UserRecord';
import UserStore from '~/stores/UserStore';
import * as SnowflakeUtils from '~/utils/SnowflakeUtils';
import {webhookUrl} from '~/utils/UrlUtils';

export type Webhook = Readonly<{
	id: string;
	guild_id: string;
	channel_id: string;
	user: UserPartial;
	name: string;
	avatar: string | null;
	token: string;
}>;

export class WebhookRecord {
	readonly id: string;
	readonly guildId: string;
	readonly channelId: string;
	readonly name: string;
	readonly avatar: string | null;
	readonly token: string;
	readonly creatorId: string;
	readonly createdAt: Date;
	private readonly creatorSnapshot: UserPartial;

	constructor(webhook: Webhook) {
		this.id = webhook.id;
		this.guildId = webhook.guild_id;
		this.channelId = webhook.channel_id;
		this.name = webhook.name;
		this.avatar = webhook.avatar ?? null;
		this.token = webhook.token;
		this.creatorId = webhook.user.id;
		this.createdAt = new Date(SnowflakeUtils.extractTimestamp(webhook.id));
		this.creatorSnapshot = webhook.user;
		UserStore.cacheUsers([webhook.user]);
	}

	get webhookUrl(): string {
		return webhookUrl(this.id, this.token);
	}

	get creator(): UserRecord | null {
		return UserStore.getUser(this.creatorId)!;
	}

	get displayName(): string {
		return this.name;
	}

	withUpdates(updates: Partial<Webhook>): WebhookRecord {
		return new WebhookRecord({
			id: updates.id ?? this.id,
			guild_id: updates.guild_id ?? this.guildId,
			channel_id: updates.channel_id ?? this.channelId,
			user: updates.user ?? this.creatorSnapshot,
			name: updates.name ?? this.name,
			avatar: updates.avatar ?? this.avatar,
			token: updates.token ?? this.token,
		});
	}

	toJSON(): Webhook {
		const creator = this.creator;
		return {
			id: this.id,
			guild_id: this.guildId,
			channel_id: this.channelId,
			user: creator ? creator.toJSON() : this.creatorSnapshot,
			name: this.name,
			avatar: this.avatar,
			token: this.token,
		};
	}
}
