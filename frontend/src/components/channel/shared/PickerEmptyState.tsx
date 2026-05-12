/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type React from 'react';
import sharedStyles from '~/components/channel/ExpressionPickerShared.module.css';

interface PickerEmptyStateProps {
	icon: React.ComponentType<{className?: string}>;
	title: string;
	description: string;
}

export const PickerEmptyState = ({icon: Icon, title, description}: PickerEmptyStateProps) => (
	<div className={sharedStyles.emptyState}>
		<div className={sharedStyles.emptyStateContent}>
			<Icon className={sharedStyles.emptyStateIcon} />
			<div className={sharedStyles.emptyStateTextContainer}>
				<h3 className={sharedStyles.emptyStateTitle}>{title}</h3>
				<p className={sharedStyles.emptyStateDescription}>{description}</p>
			</div>
		</div>
	</div>
);
