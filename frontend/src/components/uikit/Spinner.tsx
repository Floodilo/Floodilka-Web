/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import styles from './Spinner.module.css';

interface SpinnerProps {
	className?: string;
	size?: 'small' | 'medium' | 'large';
}

export const Spinner = observer(function Spinner({className, size = 'medium'}: SpinnerProps) {
	return (
		<span className={clsx(styles.spinner, className)}>
			<span className={styles.spinnerInner}>
				<span className={clsx(styles.spinnerItem, styles[size])} />
				<span className={clsx(styles.spinnerItem, styles[size], styles.delay1)} />
				<span className={clsx(styles.spinnerItem, styles[size], styles.delay2)} />
			</span>
			<span className={styles.srOnly}>
				<Trans>Loading...</Trans>
			</span>
		</span>
	);
});
