/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import styles from './ListSection.module.css';

export const ListSection = observer(
	({
		title,
		count,
		children,
		marginBottom = false,
	}: {
		title: string;
		count: number;
		children: React.ReactNode;
		marginBottom?: boolean;
	}) => (
		<>
			<div className={styles.sectionTitle}>
				{title} — {count}
			</div>
			<div className={clsx(marginBottom ? styles.sectionContentWithMargin : styles.sectionContent)}>{children}</div>
		</>
	),
);
