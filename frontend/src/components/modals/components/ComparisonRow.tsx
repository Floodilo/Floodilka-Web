/*
 * Copyright (C) 2026 Floodilka Contributors
 *
 * This file is part of Floodilka.
 *
 * Floodilka is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Floodilka is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Floodilka. If not, see <https://www.gnu.org/licenses/>.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import styles from './ComparisonRow.module.css';

export const ComparisonRow = observer(
	({
		feature,
		freeValue,
		premiumValue,
		premiumColumnRoundBottom = false,
	}: {
		feature: string;
		freeValue: React.ReactNode;
		premiumValue: React.ReactNode;
		premiumColumnRoundBottom?: boolean;
	}) => (
		<div className={clsx(styles.row, premiumColumnRoundBottom && styles.rowLast)}>
			<div className={styles.feature}>
				<p className={styles.featureText}>{feature}</p>
			</div>
			<div className={styles.freeCell}>
				<span className={styles.valueChipFree}>{freeValue}</span>
			</div>
			<div
				className={clsx(styles.premiumCell, premiumColumnRoundBottom && styles.premiumCellRoundBottom)}
				{...(premiumColumnRoundBottom ? {'data-premium-column-end': ''} : {})}
			>
				<span className={styles.valueChipPremium}>{premiumValue}</span>
			</div>
		</div>
	),
);
