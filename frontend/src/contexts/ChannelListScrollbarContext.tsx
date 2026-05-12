/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type React from 'react';
import {createContext, useContext} from 'react';

export interface ChannelListScrollbarContextValue {
	hasScrollbar: boolean;
}

export const ChannelListScrollbarContext = createContext<ChannelListScrollbarContextValue | null>(null);

export const useChannelListScrollbar = (): ChannelListScrollbarContextValue => {
	const context = useContext(ChannelListScrollbarContext);
	if (!context) {
		throw new Error('useChannelListScrollbar must be used within a ChannelListScrollbarProvider');
	}
	return context;
};

interface ChannelListScrollbarProviderProps {
	children: React.ReactNode;
	value: ChannelListScrollbarContextValue;
}

export const ChannelListScrollbarProvider: React.FC<ChannelListScrollbarProviderProps> = ({children, value}) => {
	return <ChannelListScrollbarContext.Provider value={value}>{children}</ChannelListScrollbarContext.Provider>;
};
