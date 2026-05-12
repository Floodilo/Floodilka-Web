/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import clsx from 'clsx';
import React from 'react';
import styles from '../ReportPage.module.css';
import type {FlowStep} from './types';

type Props = {
	current: FlowStep;
	hasSelection: boolean;
	hasEmail: boolean;
	hasTicket: boolean;
	onSelect: (step: FlowStep) => void;
};

const STEP_ORDER: Array<FlowStep> = ['selection', 'email', 'verification', 'details'];

export const ReportBreadcrumbs: React.FC<Props> = ({current, hasSelection, hasEmail, hasTicket, onSelect}) => {
	const isEnabled = (step: FlowStep) => {
		if (step === 'selection') return true;
		if (step === 'email') return hasSelection;
		if (step === 'verification') return hasEmail;
		if (step === 'details') return hasTicket;
		return false;
	};

	const labelMap: Record<FlowStep, React.ReactNode> = {
		selection: <Trans>Choose</Trans>,
		email: <Trans>Email</Trans>,
		verification: <Trans>Code</Trans>,
		details: <Trans>Details</Trans>,
		complete: <Trans>Done</Trans>,
	};

	return (
		<div className={styles.breadcrumbs}>
			{STEP_ORDER.map((step, index) => {
				const active = current === step;
				const clickable = !active && isEnabled(step);

				return (
					<React.Fragment key={step}>
						<button
							type="button"
							className={clsx(styles.breadcrumbStep, active && styles.breadcrumbActive)}
							disabled={!clickable}
							onClick={() => clickable && onSelect(step)}
						>
							<span className={styles.breadcrumbNumber}>{index + 1}</span>
							<span className={styles.breadcrumbLabel}>{labelMap[step]}</span>
						</button>
						{index < STEP_ORDER.length - 1 && <span className={styles.breadcrumbSeparator}>›</span>}
					</React.Fragment>
				);
			})}
		</div>
	);
};

export default ReportBreadcrumbs;
