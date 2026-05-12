/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const CATEGORY_HARASSMENT = 'harassment' as const;
export const CATEGORY_HATE_SPEECH = 'hate_speech' as const;
export const CATEGORY_SPAM = 'spam' as const;
export const CATEGORY_ILLEGAL_ACTIVITY = 'illegal_activity' as const;
export const CATEGORY_IMPERSONATION = 'impersonation' as const;
export const CATEGORY_CHILD_SAFETY = 'child_safety' as const;
export const CATEGORY_OTHER = 'other' as const;

export const CATEGORY_VIOLENT_CONTENT = 'violent_content' as const;
export const CATEGORY_NSFW_VIOLATION = 'nsfw_violation' as const;
export const CATEGORY_DOXXING = 'doxxing' as const;
export const CATEGORY_SELF_HARM = 'self_harm' as const;
export const CATEGORY_MALICIOUS_LINKS = 'malicious_links' as const;

export const CATEGORY_SPAM_ACCOUNT = 'spam_account' as const;
export const CATEGORY_UNDERAGE_USER = 'underage_user' as const;
export const CATEGORY_INAPPROPRIATE_PROFILE = 'inappropriate_profile' as const;

export const CATEGORY_RAID_COORDINATION = 'raid_coordination' as const;
export const CATEGORY_MALWARE_DISTRIBUTION = 'malware_distribution' as const;
export const CATEGORY_EXTREMIST_COMMUNITY = 'extremist_community' as const;

const REPORT_CATEGORY_GROUPS = {
	message: [
		CATEGORY_HARASSMENT,
		CATEGORY_HATE_SPEECH,
		CATEGORY_VIOLENT_CONTENT,
		CATEGORY_SPAM,
		CATEGORY_NSFW_VIOLATION,
		CATEGORY_ILLEGAL_ACTIVITY,
		CATEGORY_DOXXING,
		CATEGORY_SELF_HARM,
		CATEGORY_CHILD_SAFETY,
		CATEGORY_MALICIOUS_LINKS,
		CATEGORY_IMPERSONATION,
		CATEGORY_OTHER,
	] as const,
	user: [
		CATEGORY_HARASSMENT,
		CATEGORY_HATE_SPEECH,
		CATEGORY_SPAM_ACCOUNT,
		CATEGORY_IMPERSONATION,
		CATEGORY_UNDERAGE_USER,
		CATEGORY_INAPPROPRIATE_PROFILE,
		CATEGORY_OTHER,
	] as const,
	guild: [
		CATEGORY_HARASSMENT,
		CATEGORY_HATE_SPEECH,
		CATEGORY_EXTREMIST_COMMUNITY,
		CATEGORY_ILLEGAL_ACTIVITY,
		CATEGORY_CHILD_SAFETY,
		CATEGORY_RAID_COORDINATION,
		CATEGORY_SPAM,
		CATEGORY_MALWARE_DISTRIBUTION,
		CATEGORY_OTHER,
	] as const,
} as const;

export const MESSAGE_REPORT_CATEGORIES = REPORT_CATEGORY_GROUPS.message;
export const USER_REPORT_CATEGORIES = REPORT_CATEGORY_GROUPS.user;
export const GUILD_REPORT_CATEGORIES = REPORT_CATEGORY_GROUPS.guild;
