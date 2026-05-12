/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const getInitialsLength = (initials: string): 'short' | 'medium' | 'long' => {
	const length = initials.length;
	if (length <= 2) return 'short';
	if (length <= 4) return 'medium';
	return 'long';
};
