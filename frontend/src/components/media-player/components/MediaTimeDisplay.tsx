/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {clsx} from 'clsx';
import {formatTime} from '../utils/formatTime';
import styles from './MediaTimeDisplay.module.css';

export interface MediaTimeDisplayProps {
	currentTime: number;
	duration: number;
	size?: 'small' | 'medium' | 'large';
	compact?: boolean;
	className?: string;
}

export function MediaTimeDisplay({
	currentTime,
	duration,
	size = 'medium',
	compact = false,
	className,
}: MediaTimeDisplayProps) {
	const {t} = useLingui();
	const currentFormatted = formatTime(currentTime);
	const durationFormatted = formatTime(duration);

	return (
		<div
			className={clsx(styles.container, styles[size], compact && styles.compact, className)}
			aria-label={t`Time: ${currentFormatted} of ${durationFormatted}`}
			role="group"
		>
			<span className={styles.time}>{currentFormatted}</span>
			{!compact && (
				<>
					<span className={styles.separator}>/</span>
					<span className={clsx(styles.time, styles.duration)}>{durationFormatted}</span>
				</>
			)}
		</div>
	);
}
