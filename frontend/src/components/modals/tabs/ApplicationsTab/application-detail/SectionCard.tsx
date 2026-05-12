/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import clsx from 'clsx';
import type React from 'react';
import styles from './ApplicationDetail.module.css';

interface SectionCardProps {
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	actions?: React.ReactNode;
	tone?: 'default' | 'danger';
	children: React.ReactNode;
}

export const SectionCard: React.FC<SectionCardProps> = ({title, subtitle, actions, children, tone = 'default'}) => {
	return (
		<section className={clsx(styles.card, tone === 'danger' && styles.cardDanger)}>
			<div className={styles.cardHeader}>
				<div>
					<h3 className={styles.cardTitle}>{title}</h3>
					{subtitle && <p className={styles.cardSubtitle}>{subtitle}</p>}
				</div>
				{actions && <div className={styles.cardActions}>{actions}</div>}
			</div>
			<div className={styles.cardBody}>{children}</div>
		</section>
	);
};
