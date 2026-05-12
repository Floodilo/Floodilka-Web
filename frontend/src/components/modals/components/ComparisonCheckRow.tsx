/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {CheckIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import styles from './ComparisonCheckRow.module.css';

export const ComparisonCheckRow = observer(
	({feature, freeHas, premiumHas}: {feature: string; freeHas: boolean; premiumHas: boolean}) => (
		<div className={styles.row}>
			<div className={styles.feature}>
				<p className={styles.featureText}>{feature}</p>
			</div>
			<div className={styles.valuesContainer}>
				<div className={styles.valueCell}>
					{freeHas ? <CheckIcon className={styles.checkIcon} weight="bold" /> : <span className={styles.dash}>—</span>}
				</div>
				<div className={styles.valueCell}>
					{premiumHas ? (
						<CheckIcon className={styles.checkIcon} weight="bold" />
					) : (
						<span className={styles.dash}>—</span>
					)}
				</div>
			</div>
		</div>
	),
);
