/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Config} from '~/Config';
import {Logger} from '~/Logger';
import type {VoiceRegionRecord} from './VoiceModel';
import {VoiceRepository} from './VoiceRepository';

export class VoiceDataInitializer {
	async initialize(): Promise<void> {
		if (!Config.voice.enabled || !Config.voice.autoCreateDummyData) {
			return;
		}

		try {
			const repository = new VoiceRepository();

			const existingRegions = await repository.listRegions();
			if (existingRegions.length > 0) {
				Logger.info(
					`[VoiceDataInitializer] Deleting ${existingRegions.length} existing voice regions to recreate with fresh data...`,
				);
				for (const region of existingRegions) {
					await repository.deleteRegion(region.id);
					Logger.info(`[VoiceDataInitializer] Deleted region: ${region.name} (${region.id})`);
				}
			}

			Logger.info('[VoiceDataInitializer] Creating dummy voice regions and servers...');

			const livekitApiKey = Config.voice.apiKey;
			const livekitApiSecret = Config.voice.apiSecret;

			if (!livekitApiKey || !livekitApiSecret) {
				Logger.warn('[VoiceDataInitializer] LiveKit API key/secret not configured, cannot create dummy servers');
				return;
			}

			await this.createDefaultRegions(repository, livekitApiKey, livekitApiSecret);

			Logger.info('[VoiceDataInitializer] Successfully created dummy voice regions and servers');
		} catch (error) {
			Logger.error({error}, '[VoiceDataInitializer] Failed to create dummy voice data');
		}
	}

	private async createDefaultRegions(
		repository: VoiceRepository,
		livekitApiKey: string,
		livekitApiSecret: string,
	): Promise<void> {
		const defaultRegions: Array<{
			region: VoiceRegionRecord;
		}> = [
			{
				region: {
					id: 'us-default',
					name: 'US Default',
					emoji: '🇺🇸',
					latitude: 39.8283,
					longitude: -98.5795,
					isDefault: true,
					restrictions: {
						vipOnly: false,
						requiredGuildFeatures: new Set(),
						allowedGuildIds: new Set(),
						allowedUserIds: new Set(),
					},
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			},
			{
				region: {
					id: 'eu-default',
					name: 'EU Default',
					emoji: '🇪🇺',
					latitude: 50.0755,
					longitude: 14.4378,
					isDefault: false,
					restrictions: {
						vipOnly: false,
						requiredGuildFeatures: new Set(),
						allowedGuildIds: new Set(),
						allowedUserIds: new Set(),
					},
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			},
			{
				region: {
					id: 'asia-default',
					name: 'Asia Default',
					emoji: '🌏',
					latitude: 35.6762,
					longitude: 139.6503,
					isDefault: false,
					restrictions: {
						vipOnly: false,
						requiredGuildFeatures: new Set(),
						allowedGuildIds: new Set(),
						allowedUserIds: new Set(),
					},
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			},
		];

		const livekitEndpoint =
			Config.voice.url ||
			(() => {
				const protocol = new URL(Config.endpoints.apiPublic).protocol.slice(0, -1) === 'https' ? 'wss' : 'ws';
				return `${protocol}://${new URL(Config.endpoints.apiPublic).hostname}/livekit`;
			})();

		for (const {region} of defaultRegions) {
			await repository.createRegion(region);
			Logger.info(`[VoiceDataInitializer] Created region: ${region.name} (${region.id})`);

			const serverId = `${region.id}-server-1`;

			await repository.createServer({
				regionId: region.id,
				serverId,
				endpoint: livekitEndpoint,
				apiKey: livekitApiKey,
				apiSecret: livekitApiSecret,
				isActive: true,
				restrictions: {
					vipOnly: false,
					requiredGuildFeatures: new Set(),
					allowedGuildIds: new Set(),
					allowedUserIds: new Set(),
				},
			});

			Logger.info(`[VoiceDataInitializer] Created server: ${serverId} -> ${livekitEndpoint}`);
		}
	}
}
