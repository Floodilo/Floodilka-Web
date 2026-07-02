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

import {observer} from 'mobx-react-lite';
import styles from './ComparisonCategory.module.css';

export const ComparisonCategory = observer(
	({label, marginTopPx}: {label: string; marginTopPx?: number}) => (
	<div
		className={styles.categoryRow}
		role="presentation"
		style={marginTopPx !== undefined ? {marginTop: marginTopPx} : undefined}
	>
		<div className={styles.feature}>
			<h3 className={styles.label}>{label}</h3>
		</div>
		<div className={styles.freeCell} aria-hidden />
		<div className={styles.thirdCell} aria-hidden />
	</div>
	),
);
