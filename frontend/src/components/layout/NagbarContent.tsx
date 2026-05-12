/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import type React from 'react';
import styles from './NagbarContent.module.css';

interface NagbarContentProps {
	message: React.ReactNode;
	actions?: React.ReactNode;
	isMobile: boolean;
}

export const NagbarContent = ({message, actions, isMobile}: NagbarContentProps) => {
	return (
		<div className={clsx(styles.container, isMobile && styles.containerMobile)}>
			<p className={styles.message}>{message}</p>
			{actions && <div className={clsx(styles.actions, isMobile && styles.actionsMobile)}>{actions}</div>}
		</div>
	);
};
