/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';

export type LayoutVariant = 'app' | 'auth';

interface LayoutVariantContextValue {
	variant: LayoutVariant;
	setVariant: (variant: LayoutVariant) => void;
}

const defaultValue: LayoutVariantContextValue = {
	variant: 'app',
	setVariant: () => {},
};

const LayoutVariantContext = React.createContext<LayoutVariantContextValue>(defaultValue);

export const LayoutVariantProvider = LayoutVariantContext.Provider;

export const useLayoutVariant = () => React.useContext(LayoutVariantContext).variant;

export const useSetLayoutVariant = () => React.useContext(LayoutVariantContext).setVariant;
