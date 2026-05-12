/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

const GROUP_DM_COLORS = ['#dc2626', '#ea580c', '#65a30d', '#2563eb', '#9333ea', '#db2777'];

const hashString = (value: string): number => {
	let hash = 0;
	for (let i = 0; i < value.length; i += 1) {
		hash = (hash * 31 + value.charCodeAt(i)) & 0xffffffff;
	}
	return hash;
};

export const getGroupDMAccentColor = (channelId: string): string => {
	if (!channelId) {
		return GROUP_DM_COLORS[0]!;
	}
	const hash = Math.abs(hashString(channelId));
	return GROUP_DM_COLORS[hash % GROUP_DM_COLORS.length]!;
};
