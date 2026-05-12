/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import type React from 'react';
import type {RadioOption} from '~/components/uikit/RadioGroup/RadioGroup';
import {RadioGroup} from '~/components/uikit/RadioGroup/RadioGroup';
import styles from '../ReportPage.module.css';
import type {ReportType} from './types';

type Props = {
	reportTypeOptions: ReadonlyArray<RadioOption<ReportType>>;
	selectedType: ReportType | null;
	onSelect: (type: ReportType) => void;
};

export const ReportStepSelection: React.FC<Props> = ({reportTypeOptions, selectedType, onSelect}) => {
	return (
		<div className={styles.card}>
			<header className={styles.cardHeader}>
				<p className={styles.eyebrow}>
					<Trans>Step 1</Trans>
				</p>
				<h1 className={styles.title}>
					<Trans>Report Illegal Content</Trans>
				</h1>
				<p className={styles.description}>
					<Trans>Select what you want to report.</Trans>
				</p>
			</header>

			<div className={styles.cardBody}>
				<RadioGroup<ReportType>
					options={reportTypeOptions}
					value={selectedType}
					onChange={onSelect}
					aria-label="Report Type"
				/>
			</div>
		</div>
	);
};

export default ReportStepSelection;
