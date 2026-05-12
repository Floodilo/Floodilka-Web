/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserRecord} from '~/records/UserRecord';
import {getDefaultAvatarPrimaryColor} from '~/utils/AvatarUtils';
import {int2hex} from '~/utils/ColorUtils';

export const getPlaceholderAvatarColor = (user: UserRecord | null | undefined, fallback: string): string => {
	if (!user) return fallback;
	if (typeof user.avatarColor === 'number') return int2hex(user.avatarColor);
	if (!user.avatar) {
		return int2hex(getDefaultAvatarPrimaryColor(user.id));
	}
	return fallback;
};
