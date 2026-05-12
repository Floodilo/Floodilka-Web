/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {RateLimitSection} from '~/rate_limit_configs/helpers';
import {mergeRateLimitSections} from '~/rate_limit_configs/helpers';
import {AdminRateLimitConfigs} from './rate_limit_configs/AdminRateLimitConfig';
import {AuthRateLimitConfigs} from './rate_limit_configs/AuthRateLimitConfig';
import {ChannelRateLimitConfigs} from './rate_limit_configs/ChannelRateLimitConfig';
import {GuildRateLimitConfigs} from './rate_limit_configs/GuildRateLimitConfig';
import {IntegrationRateLimitConfigs} from './rate_limit_configs/IntegrationRateLimitConfig';
import {InviteRateLimitConfigs} from './rate_limit_configs/InviteRateLimitConfig';
import {MiscRateLimitConfigs} from './rate_limit_configs/MiscRateLimitConfig';
import {OAuthRateLimitConfigs} from './rate_limit_configs/OAuthRateLimitConfig';
import {PackRateLimitConfigs} from './rate_limit_configs/PackRateLimitConfig';
import {UserRateLimitConfigs} from './rate_limit_configs/UserRateLimitConfig';
import {WebhookRateLimitConfigs} from './rate_limit_configs/WebhookRateLimitConfig';

const rateLimitSections = [
	AuthRateLimitConfigs,
	OAuthRateLimitConfigs,
	UserRateLimitConfigs,
	ChannelRateLimitConfigs,
	GuildRateLimitConfigs,
	InviteRateLimitConfigs,
	WebhookRateLimitConfigs,
	IntegrationRateLimitConfigs,
	AdminRateLimitConfigs,
	MiscRateLimitConfigs,
	PackRateLimitConfigs,
] satisfies ReadonlyArray<RateLimitSection>;

export const RateLimitConfigs = mergeRateLimitSections(...rateLimitSections);
