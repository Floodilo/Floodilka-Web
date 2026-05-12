/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import pino from 'pino';
import {Config} from '~/Config';

export const Logger = pino({
	level: Config.NODE_ENV === 'development' ? 'debug' : 'info',
	transport:
		Config.NODE_ENV === 'development'
			? {
					target: 'pino-pretty',
					options: {
						colorize: true,
						translateTime: 'HH:MM:ss.l',
						ignore: 'pid,hostname',
						messageFormat: '{msg}',
					},
				}
			: undefined,
	formatters: {
		level: (label) => ({level: label}),
	},
	errorKey: 'error',
	serializers: {
		reason: (value) => {
			if (value instanceof Error) {
				return pino.stdSerializers.err(value);
			}
			return value;
		},
	},
	timestamp: pino.stdTimeFunctions.isoTime,
	base: {
		service: 'floodilka-media-proxy',
	},
});
