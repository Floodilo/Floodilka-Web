/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import DeveloperOptionsStore from '~/stores/DeveloperOptionsStore';

export const useEmbedSkeletonOverride = (): boolean => {
	return React.useMemo(() => {
		if (!DeveloperOptionsStore.forceEmbedSkeletons) return false;
		return Math.random() < 0.5;
	}, [DeveloperOptionsStore.forceEmbedSkeletons]);
};
