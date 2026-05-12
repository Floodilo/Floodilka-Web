/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import {useScrollSpy} from './useScrollSpy';

export interface ScrollSpyContextValue {
	activeSectionId: string | null;
	scrollToSection: (sectionId: string) => void;
	sectionIds: ReadonlyArray<string>;
}

const ScrollSpyContext = React.createContext<ScrollSpyContextValue | null>(null);

export interface ScrollSpyProviderProps {
	sectionIds: ReadonlyArray<string>;
	containerRef: React.RefObject<HTMLElement | null>;
	offset?: number;
	children: React.ReactNode;
}

export const ScrollSpyProvider: React.FC<ScrollSpyProviderProps> = ({sectionIds, containerRef, offset, children}) => {
	const {activeSectionId, scrollToSection} = useScrollSpy({sectionIds, containerRef, offset});

	const contextValue = React.useMemo<ScrollSpyContextValue>(
		() => ({
			activeSectionId,
			scrollToSection,
			sectionIds,
		}),
		[activeSectionId, scrollToSection, sectionIds],
	);

	return <ScrollSpyContext.Provider value={contextValue}>{children}</ScrollSpyContext.Provider>;
};

export function useScrollSpyContext(): ScrollSpyContextValue | null {
	return React.useContext(ScrollSpyContext);
}
