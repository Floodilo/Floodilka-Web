/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createInviteCode, createVanityURLCode, type GuildID, type UserID, vanityCodeToInviteCode} from '~/BrandedTypes';
import {GuildFeatures, InviteTypes, Permissions} from '~/Constants';
import {AuditLogActionType} from '~/constants/AuditLogActionType';
import {InputValidationError, UnknownGuildError} from '~/Errors';
import type {GuildVanityURLResponse} from '~/guild/GuildModel';
import type {IGuildRepository} from '~/guild/IGuildRepository';
import type {InviteRepository} from '~/invite/InviteRepository';
import type {RequestCache} from '~/middleware/RequestCacheMiddleware';
import type {GuildDataHelpers} from './GuildDataHelpers';

export class GuildVanityService {
	constructor(
		private readonly guildRepository: IGuildRepository,
		private readonly inviteRepository: InviteRepository,
		private readonly helpers: GuildDataHelpers,
	) {}

	async getVanityURL(params: {userId: UserID; guildId: GuildID}): Promise<GuildVanityURLResponse> {
		const {userId, guildId} = params;
		const {guildData, checkPermission} = await this.helpers.getGuildAuthenticated({userId, guildId});
		await checkPermission(Permissions.MANAGE_GUILD);

		if (!guildData) throw new UnknownGuildError();

		const vanityCodeString = guildData.vanity_url_code;

		if (!vanityCodeString) {
			return {code: null, uses: 0};
		}

		const vanityCode = createVanityURLCode(vanityCodeString);
		const invite = await this.inviteRepository.findUnique(vanityCodeToInviteCode(vanityCode));

		return {
			code: vanityCodeString,
			uses: invite?.uses ?? 0,
		};
	}

	async updateVanityURL(
		params: {userId: UserID; guildId: GuildID; code: string | null; requestCache: RequestCache},
		auditLogReason?: string | null,
	): Promise<{code: string}> {
		const {userId, guildId, code} = params;
		const {checkPermission} = await this.helpers.getGuildAuthenticated({userId, guildId});
		await checkPermission(Permissions.MANAGE_GUILD);

		const guild = await this.guildRepository.findUnique(guildId);
		if (!guild) throw new UnknownGuildError();

		const previousSnapshot = this.helpers.serializeGuildForAudit(guild);

		if (code && !guild.features.has(GuildFeatures.VANITY_URL)) {
			throw InputValidationError.create('code', 'Для короткой ссылки требуется функция VANITY_URL');
		}

		if (code && /floodilka|fludilka/i.test(code)) {
			throw InputValidationError.create('code', 'Код короткой ссылки не может содержать зарезервированные слова');
		}

		if (code != null && guild.vanityUrlCode === code) {
			return {code};
		}

		if (code == null) {
			if (guild.vanityUrlCode != null) {
				const oldInvite = await this.inviteRepository.findUnique(vanityCodeToInviteCode(guild.vanityUrlCode));
				if (oldInvite) {
					await this.inviteRepository.delete(oldInvite.code);
				}
				const updatedGuild = await this.guildRepository.upsert({...guild.toRow(), vanity_url_code: null});
				await this.helpers.dispatchGuildUpdate(updatedGuild);
				await this.helpers.recordAuditLog({
					guildId,
					userId,
					action: AuditLogActionType.GUILD_UPDATE,
					targetId: guildId,
					auditLogReason: auditLogReason ?? null,
					metadata: {vanity_url_code: ''},
					changes: this.helpers.computeGuildChanges(previousSnapshot, updatedGuild),
				});
				return {code: ''};
			}
			return {code: ''};
		}

		const existingInvite = await this.inviteRepository.findUnique(createInviteCode(code));
		if (existingInvite != null) {
			throw InputValidationError.create('code', 'Этот код короткой ссылки уже занят');
		}

		if (guild.vanityUrlCode != null) {
			const oldInvite = await this.inviteRepository.findUnique(vanityCodeToInviteCode(guild.vanityUrlCode));
			if (oldInvite) {
				await this.inviteRepository.delete(oldInvite.code);
			}
		}

		await this.inviteRepository.create({
			code: createInviteCode(code),
			type: InviteTypes.GUILD,
			guild_id: guildId,
			channel_id: null,
			inviter_id: null,
			uses: 0,
			max_uses: 0,
			max_age: 0,
		});

		const updatedGuild = await this.guildRepository.upsert({
			...guild.toRow(),
			vanity_url_code: createVanityURLCode(code),
		});
		await this.helpers.dispatchGuildUpdate(updatedGuild);

		await this.helpers.recordAuditLog({
			guildId,
			userId,
			action: AuditLogActionType.GUILD_UPDATE,
			targetId: guildId,
			auditLogReason: auditLogReason ?? null,
			metadata: {vanity_url_code: code},
			changes: this.helpers.computeGuildChanges(previousSnapshot, updatedGuild),
		});

		return {code};
	}
}
