/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import type React from 'react';
import styles from './NativeTrafficLightsBackdrop.module.css';

interface NativeTrafficLightsBackdropProps {
	variant?: 'app' | 'auth';
	className?: string;
}

export const NativeTrafficLightsBackdrop: React.FC<NativeTrafficLightsBackdropProps> = ({
	variant = 'app',
	className,
}) => {
	return (
		<div
			aria-hidden="true"
			className={clsx(styles.backdropBase, variant === 'auth' ? styles.backdropAuth : styles.backdropApp, className)}
		/>
	);
};
