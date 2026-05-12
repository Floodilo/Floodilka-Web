/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';
import type {PackDashboardResponse, PackSummary} from '~/types/PackTypes';

const logger = new Logger('Packs');

export const list = async (): Promise<PackDashboardResponse> => {
	try {
		logger.debug('Requesting pack dashboard');
		const response = await http.get<PackDashboardResponse>({url: Endpoints.PACKS});
		return response.body;
	} catch (error) {
		logger.error('Failed to fetch pack dashboard:', error);
		throw error;
	}
};

export const create = async (
	type: 'emoji' | 'sticker',
	name: string,
	description?: string | null,
): Promise<PackSummary> => {
	try {
		logger.debug(`Creating ${type} pack ${name}`);
		const response = await http.post<PackSummary>({
			url: Endpoints.PACK_CREATE(type),
			body: {name, description: description ?? null},
		});
		return response.body;
	} catch (error) {
		logger.error(`Failed to create ${type} pack:`, error);
		throw error;
	}
};

export const update = async (
	packId: string,
	data: {name?: string; description?: string | null},
): Promise<PackSummary> => {
	try {
		logger.debug(`Updating pack ${packId}`);
		const response = await http.patch<PackSummary>({url: Endpoints.PACK(packId), body: data});
		return response.body;
	} catch (error) {
		logger.error(`Failed to update pack ${packId}:`, error);
		throw error;
	}
};

export const remove = async (packId: string): Promise<void> => {
	try {
		logger.debug(`Deleting pack ${packId}`);
		await http.delete({url: Endpoints.PACK(packId)});
	} catch (error) {
		logger.error(`Failed to delete pack ${packId}:`, error);
		throw error;
	}
};

export const install = async (packId: string): Promise<void> => {
	try {
		logger.debug(`Installing pack ${packId}`);
		await http.post({url: Endpoints.PACK_INSTALL(packId)});
	} catch (error) {
		logger.error(`Failed to install pack ${packId}:`, error);
		throw error;
	}
};

export const uninstall = async (packId: string): Promise<void> => {
	try {
		logger.debug(`Uninstalling pack ${packId}`);
		await http.delete({url: Endpoints.PACK_INSTALL(packId)});
	} catch (error) {
		logger.error(`Failed to uninstall pack ${packId}:`, error);
		throw error;
	}
};
