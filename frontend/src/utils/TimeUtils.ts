/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {DateTime} from 'luxon';

export function formatShortRelativeTime(timestamp: number): string {
	const date = DateTime.fromMillis(timestamp);
	const now = DateTime.now();
	const diff = now.diff(date);

	const minutes = diff.as('minutes');
	const hours = diff.as('hours');
	const days = diff.as('days');
	const weeks = diff.as('weeks');
	const months = diff.as('months');
	const years = diff.as('years');

	if (minutes < 1) {
		return '1m';
	}
	if (minutes < 60) {
		return `${Math.floor(minutes)}m`;
	}
	if (hours < 24) {
		return `${Math.floor(hours)}h`;
	}
	if (days < 7) {
		return `${Math.floor(days)}d`;
	}
	if (weeks < 4) {
		return `${Math.floor(weeks)}w`;
	}
	if (months < 12) {
		return `${Math.floor(months)}mo`;
	}
	return `${Math.floor(years)}y`;
}
