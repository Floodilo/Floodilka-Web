/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type React from 'react';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';

interface PurchaseDisabledWrapperProps {
	disabled: boolean;
	tooltipText: React.ReactNode;
	children: React.ReactElement;
}

export const PurchaseDisabledWrapper: React.FC<PurchaseDisabledWrapperProps> = ({disabled, tooltipText, children}) => {
	if (!disabled) return children;

	const tooltipContent = typeof tooltipText === 'function' ? (tooltipText as () => React.ReactNode) : () => tooltipText;

	return (
		<Tooltip text={tooltipContent}>
			<div>{children}</div>
		</Tooltip>
	);
};
