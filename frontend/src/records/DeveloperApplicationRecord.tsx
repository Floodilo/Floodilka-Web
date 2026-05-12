/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export interface DeveloperApplicationBot {
	id: string;
	username: string;
	avatar: string | null;
	bio?: string | null;
	token?: string;
	banner?: string | null;
}

export interface DeveloperApplication {
	id: string;
	name: string;
	redirect_uris: Array<string>;
	bot_public: boolean;
	bot_require_code_grant: boolean;
	client_secret?: string;
	bot?: DeveloperApplicationBot;
}

export class DeveloperApplicationRecord implements DeveloperApplication {
	readonly id: string;
	readonly name: string;
	readonly redirect_uris: Array<string>;
	readonly bot_public: boolean;
	readonly bot_require_code_grant: boolean;
	readonly client_secret?: string;
	readonly bot?: DeveloperApplicationBot;

	constructor(application: DeveloperApplication) {
		this.id = application.id;
		this.name = application.name;
		this.redirect_uris = application.redirect_uris ? [...application.redirect_uris] : [];
		this.bot_public = application.bot_public;
		this.bot_require_code_grant = application.bot_require_code_grant;
		if ('client_secret' in application) {
			this.client_secret = application.client_secret;
		}
		if (application.bot) {
			this.bot = {
				id: application.bot.id,
				username: application.bot.username,
				avatar: application.bot.avatar,
				bio: application.bot.bio ?? null,
				token: application.bot.token,
				banner: application.bot.banner ?? null,
			};
		}
	}

	static from(application: DeveloperApplication): DeveloperApplicationRecord {
		return new DeveloperApplicationRecord(application);
	}

	withUpdates(updates: Partial<DeveloperApplication>): DeveloperApplicationRecord {
		return new DeveloperApplicationRecord({
			...this.toObject(),
			...updates,
			redirect_uris: updates.redirect_uris ?? this.redirect_uris,
			bot: updates.bot ?? this.bot,
		});
	}

	toObject(): DeveloperApplication {
		return {
			id: this.id,
			name: this.name,
			redirect_uris: [...this.redirect_uris],
			bot_public: this.bot_public,
			bot_require_code_grant: this.bot_require_code_grant,
			client_secret: this.client_secret,
			bot: this.bot ? {...this.bot} : undefined,
		};
	}
}
