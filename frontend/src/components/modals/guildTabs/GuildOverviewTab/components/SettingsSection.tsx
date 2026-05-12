/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type React from 'react';
import styles from '../GuildOverviewTab.module.css';

export const SettingsSection: React.FC<{
	title: React.ReactNode;
	description?: React.ReactNode;
	children: React.ReactNode;
}> = ({title, description, children}) => {
	return (
		<section className={styles.section}>
			<div className={styles.sectionHeader}>
				<h2 className={styles.sectionTitle}>{title}</h2>
				{description ? <p className={styles.sectionDescription}>{description}</p> : null}
			</div>
			{children}
		</section>
	);
};
