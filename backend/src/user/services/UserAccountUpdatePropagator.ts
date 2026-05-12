/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import {GatewayRpcClient} from '~/infrastructure/GatewayRpcClient';
import type {IGatewayService} from '~/infrastructure/IGatewayService';
import type {IMediaService} from '~/infrastructure/IMediaService';
import type {UserCacheService} from '~/infrastructure/UserCacheService';
import {Logger} from '~/Logger';
import type {UserGuildSettings, UserSettings} from '~/Models';
import {mapUserGuildSettingsToResponse, mapUserSettingsToResponse} from '~/user/UserModel';
import {BaseUserUpdatePropagator} from './BaseUserUpdatePropagator';

interface UserAccountUpdatePropagatorDeps {
	userCacheService: UserCacheService;
	gatewayService: IGatewayService;
	mediaService: IMediaService;
}

export class UserAccountUpdatePropagator extends BaseUserUpdatePropagator {
	constructor(private readonly deps: UserAccountUpdatePropagatorDeps) {
		super({
			userCacheService: deps.userCacheService,
			gatewayService: deps.gatewayService,
		});
	}

	async dispatchUserSettingsUpdate({userId, settings}: {userId: UserID; settings: UserSettings}): Promise<void> {
		await this.deps.gatewayService.dispatchPresence({
			userId,
			event: 'USER_SETTINGS_UPDATE',
			data: mapUserSettingsToResponse({settings}),
		});
	}

	async dispatchUserGuildSettingsUpdate({
		userId,
		settings,
	}: {
		userId: UserID;
		settings: UserGuildSettings;
	}): Promise<void> {
		await this.deps.gatewayService.dispatchPresence({
			userId,
			event: 'USER_GUILD_SETTINGS_UPDATE',
			data: mapUserGuildSettingsToResponse(settings),
		});

		// Sync push notification cache in gateway so eligibility checks use updated settings
		const settingsPayload = mapUserGuildSettingsToResponse(settings);
		Logger.info('[UserAccountUpdatePropagator] Syncing push cache for user %s guild %s: %j', userId.toString(), settings.guildId.toString(), settingsPayload);
		try {
			const result = await GatewayRpcClient.getInstance().call('push.sync_user_guild_settings', {
				user_id: userId.toString(),
				guild_id: settings.guildId.toString(),
				user_guild_settings: settingsPayload,
			});
			Logger.info('[UserAccountUpdatePropagator] Push cache sync result: %j', result);
		} catch (error) {
			Logger.error({error}, '[UserAccountUpdatePropagator] Failed to sync push guild settings cache');
		}
	}

	async dispatchUserNoteUpdate(params: {userId: UserID; targetId: UserID; note: string}): Promise<void> {
		const {userId, targetId, note} = params;
		await this.deps.gatewayService.dispatchPresence({
			userId,
			event: 'USER_NOTE_UPDATE',
			data: {id: targetId.toString(), note},
		});
	}
}
