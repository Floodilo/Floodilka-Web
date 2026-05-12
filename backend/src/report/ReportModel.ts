/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {GUILD_REPORT_CATEGORIES, MESSAGE_REPORT_CATEGORIES, USER_REPORT_CATEGORIES} from '~/constants/ReportCategories';
import {createStringType, EmailType, Int64Type, z} from '~/Schema';

const EU_COUNTRY_CODES = [
	'AT',
	'BE',
	'BG',
	'HR',
	'CY',
	'CZ',
	'DK',
	'EE',
	'FI',
	'FR',
	'DE',
	'GR',
	'HU',
	'IE',
	'IT',
	'LV',
	'LT',
	'LU',
	'MT',
	'NL',
	'PL',
	'PT',
	'RO',
	'SK',
	'SI',
	'ES',
	'SE',
] as const;

const EU_COUNTRY_CODE_ENUM = z.enum(EU_COUNTRY_CODES);
export const ReportMessageRequest = z.object({
	channel_id: Int64Type,
	message_id: Int64Type,
	category: z.enum(MESSAGE_REPORT_CATEGORIES),
	additional_info: z.optional(createStringType(0, 1000)),
});

export const ReportUserRequest = z.object({
	user_id: Int64Type,
	category: z.enum(USER_REPORT_CATEGORIES),
	additional_info: z.optional(createStringType(0, 1000)),
	guild_id: z.optional(Int64Type),
});

export const ReportGuildRequest = z.object({
	guild_id: Int64Type,
	category: z.enum(GUILD_REPORT_CATEGORIES),
	additional_info: z.optional(createStringType(0, 1000)),
});

const DSA_VERIFICATION_CODE_TYPE = createStringType(9, 9).refine(
	(value) => /^[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(value),
	'Verification code must have the format XXXX-XXXX (uppercase letters and digits)',
);

export const DsaReportEmailSendRequest = z.object({
	email: EmailType,
});

export const DsaReportEmailVerifyRequest = z.object({
	email: EmailType,
	code: DSA_VERIFICATION_CODE_TYPE,
});

const DsaReportBase = z.object({
	ticket: createStringType(1, 128),
	additional_info: z.optional(createStringType(0, 1000)),
	reporter_full_legal_name: createStringType(1, 160),
	reporter_country_of_residence: EU_COUNTRY_CODE_ENUM,
});

const DsaReportMessage = DsaReportBase.extend({
	report_type: z.literal('message'),
	category: z.enum(MESSAGE_REPORT_CATEGORIES),
	message_link: createStringType(1, 2048),
});

const DsaReportUser = DsaReportBase.extend({
	report_type: z.literal('user'),
	category: z.enum(USER_REPORT_CATEGORIES),
	user_id: Int64Type,
});

const DsaReportGuild = DsaReportBase.extend({
	report_type: z.literal('guild'),
	category: z.enum(GUILD_REPORT_CATEGORIES),
	guild_id: Int64Type,
	invite_code: z.optional(createStringType(1, 64)),
});

export const DsaReportRequest = z.discriminatedUnion('report_type', [DsaReportMessage, DsaReportUser, DsaReportGuild]);

export type DsaReportRequest = z.infer<typeof DsaReportRequest>;

export type ReportMessageRequest = z.infer<typeof ReportMessageRequest>;
export type ReportUserRequest = z.infer<typeof ReportUserRequest>;
export type ReportGuildRequest = z.infer<typeof ReportGuildRequest>;
