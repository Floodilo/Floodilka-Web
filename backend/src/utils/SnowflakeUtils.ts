/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {FLOODILKA_EPOCH} from '~/Constants';

export const getSnowflake = (timestamp: number = Date.now()) => BigInt(timestamp - FLOODILKA_EPOCH) << 22n;

export const extractTimestamp = (snowflake: bigint) => Number(snowflake >> 22n) + FLOODILKA_EPOCH;
