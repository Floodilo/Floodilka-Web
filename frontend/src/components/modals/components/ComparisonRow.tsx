/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';
import styles from './ComparisonRow.module.css';

export const ComparisonRow = observer(
	({
		feature,
		freeValue,
		premiumValue,
	}: {
		feature: string;
		freeValue: React.ReactNode;
		premiumValue: React.ReactNode;
	}) => (
		<div className={styles.row}>
			<div className={styles.feature}>
				<p className={styles.featureText}>{feature}</p>
			</div>
			<div className={styles.valuesContainer}>
				<div className={styles.freeValue}>{freeValue}</div>
				<div className={styles.premiumValue}>{premiumValue}</div>
			</div>
		</div>
	),
);
