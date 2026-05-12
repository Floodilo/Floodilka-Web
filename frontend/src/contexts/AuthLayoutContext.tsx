/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import type {GuildSplashCardAlignmentValue} from '~/Constants';

interface AuthLayoutContextType {
	setSplashUrl: (url: string | null) => void;
	setShowLogoSide: (show: boolean) => void;
	setSplashCardAlignment: React.Dispatch<React.SetStateAction<GuildSplashCardAlignmentValue>>;
}

export const AuthLayoutContext = React.createContext<AuthLayoutContextType | null>(null);

export const useAuthLayoutContext = () => {
	const context = React.useContext(AuthLayoutContext);
	if (!context) {
		throw new Error('useAuthLayoutContext must be used within AuthLayoutProvider');
	}
	return context;
};
