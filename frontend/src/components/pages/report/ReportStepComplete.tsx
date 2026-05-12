/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {CheckCircleIcon} from '@phosphor-icons/react';
import type React from 'react';
import {StatusSlate} from '~/components/modals/shared/StatusSlate';

const FilledCheckCircleIcon: React.FC<React.ComponentProps<typeof CheckCircleIcon>> = (props) => (
	<CheckCircleIcon weight="fill" {...props} />
);

type Props = {
	onStartOver: () => void;
};

export const ReportStepComplete: React.FC<Props> = ({onStartOver}) => (
	<StatusSlate
		Icon={FilledCheckCircleIcon}
		title={<Trans>Report submitted</Trans>}
		description={<Trans>Thank you for helping keep Флудилка safe. We'll review your report as soon as possible.</Trans>}
		iconStyle={{color: 'var(--status-success)'}}
		actions={[
			{
				text: <Trans>Submit another report</Trans>,
				onClick: onStartOver,
				variant: 'secondary',
			},
		]}
	/>
);

export default ReportStepComplete;
