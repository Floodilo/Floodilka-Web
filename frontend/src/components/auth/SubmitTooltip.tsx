/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageDescriptor} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react/macro';
import type {ReactNode} from 'react';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import styles from './SubmitTooltip.module.css';

export interface MissingField {
	key: string;
	label: string;
}

export interface SubmitTooltipProps {
	children: ReactNode;
	consent: boolean;
	missingFields?: Array<MissingField>;
}

const CONSENT_REQUIRED_DESCRIPTOR = msg`You must agree to the Terms of Service and Privacy Policy to create an account`;
const getMissingFieldsDescriptor = (fieldList: string): MessageDescriptor =>
	msg`Please fill out the following fields: ${fieldList}`;

function getTooltipContentDescriptor(consent: boolean, missingFields: Array<MissingField>): MessageDescriptor | null {
	if (!consent) {
		return CONSENT_REQUIRED_DESCRIPTOR;
	}

	if (missingFields.length > 0) {
		const fieldList = missingFields.map((f) => f.label).join(', ');
		return getMissingFieldsDescriptor(fieldList);
	}

	return null;
}

export function shouldDisableSubmit(consent: boolean, missingFields: Array<MissingField>): boolean {
	return !consent || missingFields.length > 0;
}

export function SubmitTooltip({children, consent, missingFields = []}: SubmitTooltipProps) {
	const {t} = useLingui();
	const tooltipContentDescriptor = getTooltipContentDescriptor(consent, missingFields);
	const tooltipContent = tooltipContentDescriptor ? t(tooltipContentDescriptor) : null;

	if (!tooltipContent) {
		return <>{children}</>;
	}

	return (
		<Tooltip text={tooltipContent} position="top">
			<div className={styles.buttonWrapper}>{children}</div>
		</Tooltip>
	);
}
