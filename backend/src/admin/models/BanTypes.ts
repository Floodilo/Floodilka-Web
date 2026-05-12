/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createStringType, EmailType, PhoneNumberType, z} from '~/Schema';
import {isValidIpOrRange} from '~/utils/IpRangeUtils';

export const BanIpRequest = z.object({
	ip: createStringType(1, 45).refine(
		(value) => isValidIpOrRange(value),
		'Must be a valid IPv4/IPv6 address or CIDR range',
	),
});

export type BanIpRequest = z.infer<typeof BanIpRequest>;

export const BanEmailRequest = z.object({
	email: EmailType,
});

export type BanEmailRequest = z.infer<typeof BanEmailRequest>;

export const BanPhoneRequest = z.object({
	phone: PhoneNumberType,
});

export type BanPhoneRequest = z.infer<typeof BanPhoneRequest>;
