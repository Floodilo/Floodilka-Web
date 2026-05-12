/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';

interface SettingsContentKeyContextValue {
	contentKey: string | null;
	setContentKey: (key: string | null) => void;
	resetContentKey: () => void;
}

const SettingsContentKeyContext = React.createContext<SettingsContentKeyContextValue | null>(null);

export const SettingsContentKeyProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
	const [contentKey, setContentKey] = React.useState<string | null>(null);

	const handleSetContentKey = React.useCallback((key: string | null) => {
		setContentKey(key);
	}, []);

	const resetContentKey = React.useCallback(() => {
		setContentKey(null);
	}, []);

	const value = React.useMemo(
		() => ({
			contentKey,
			setContentKey: handleSetContentKey,
			resetContentKey,
		}),
		[contentKey, handleSetContentKey, resetContentKey],
	);

	return <SettingsContentKeyContext.Provider value={value}>{children}</SettingsContentKeyContext.Provider>;
};

export const useSettingsContentKey = (): SettingsContentKeyContextValue => {
	const context = React.useContext(SettingsContentKeyContext);

	if (!context) {
		return {
			contentKey: null,
			setContentKey: () => {},
			resetContentKey: () => {},
		};
	}

	return context;
};
