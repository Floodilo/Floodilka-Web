/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {WarningIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import type React from 'react';
import styles from './WarningAlert.module.css';

interface WarningAlertProps {
	title?: React.ReactNode;
	children: React.ReactNode;
	link?: {
		label: React.ReactNode;
		onClick: () => void;
	};
	actions?: React.ReactNode;
	className?: string;
}

export const WarningAlert: React.FC<WarningAlertProps> = ({title, children, link, actions, className}) => {
	return (
		<div className={clsx(styles.alert, className)}>
			<WarningIcon size={16} weight="fill" className={styles.icon} />
			<div className={styles.content}>
				{title && <h4 className={styles.title}>{title}</h4>}
				<p className={styles.text}>{children}</p>
				{link && (
					<button type="button" className={styles.link} onClick={link.onClick}>
						{link.label}
					</button>
				)}
				{actions && <div className={styles.actions}>{actions}</div>}
			</div>
		</div>
	);
};
