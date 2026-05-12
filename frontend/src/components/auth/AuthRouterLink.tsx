/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ReactNode} from 'react';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {Link as RouterLink} from '~/lib/router';

interface AuthRouterLinkProps {
	ringOffset?: number;
	children?: ReactNode;
	className?: string;
	to: string;
	search?: Record<string, string | undefined>;
}

export function AuthRouterLink({ringOffset = -2, children, className, to, search}: AuthRouterLinkProps) {
	return (
		<FocusRing offset={ringOffset}>
			<RouterLink tabIndex={0} className={className} to={to} search={search}>
				{children}
			</RouterLink>
		</FocusRing>
	);
}
