/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {WarningCircleIcon} from '@phosphor-icons/react';
import type React from 'react';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';

export const UserProfileDataWarning: React.FC = () => {
	const {t} = useLingui();
	const WARNING_TOOLTIP = t`We failed to retrieve the full information about this user at this time.`;

	return (
		<Tooltip text={WARNING_TOOLTIP} maxWidth="xl">
			<FocusRing offset={-2}>
				<span
					role="img"
					aria-label={WARNING_TOOLTIP}
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						justifyContent: 'center',
						width: 28,
						height: 28,
					}}
				>
					<WarningCircleIcon weight="fill" size={18} color="var(--status-warning)" />
				</span>
			</FocusRing>
		</Tooltip>
	);
};
