/*
 * Copyright (C) 2026 Floodilka Contributors
 *
 * This file is part of Floodilka.
 *
 * Floodilka is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Floodilka is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Floodilka. If not, see <https://www.gnu.org/licenses/>.
 */

import {BUILD_CHANNEL} from './build-channel.js';

const parsePort = (envName: string, fallback: number): number => {
	const value = process.env[envName];
	if (!value) return fallback;

	const parsed = Number.parseInt(value, 10);
	if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) return fallback;

	return parsed;
};

const channelPort = (stable: number, canary: number): number => (BUILD_CHANNEL === 'canary' ? canary : stable);

export const RPC_PORT = parsePort('FLOODILKA_RPC_PORT', channelPort(21863, 21864));
export const API_PROXY_PORT = parsePort('FLOODILKA_API_PROXY_PORT', channelPort(21861, 21862));
export const WS_PROXY_PORT = parsePort('FLOODILKA_WS_PROXY_PORT', channelPort(21865, 21866));
export const MEDIA_PROXY_PORT = parsePort('FLOODILKA_MEDIA_PROXY_PORT', channelPort(21867, 21868));
