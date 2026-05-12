/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {ClockIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';

import styles from './SlowmodeIndicator.module.css';

interface SlowmodeIndicatorProps {
	slowmodeRemaining: number;
}

export const SlowmodeIndicator = observer(({slowmodeRemaining}: SlowmodeIndicatorProps) => {
	if (slowmodeRemaining <= 0) {
		return null;
	}

	const formatTime = (ms: number): string => {
		const totalSeconds = Math.ceil(ms / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;

		if (hours > 0) {
			return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		}

		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	};

	return (
		<Tooltip text={() => <Trans>You are in slowmode. Please wait before sending another message.</Trans>}>
			<div className={styles.container}>
				<ClockIcon size={12} weight="fill" />
				<span className={styles.time}>{formatTime(slowmodeRemaining)}</span>
			</div>
		</Tooltip>
	);
});
