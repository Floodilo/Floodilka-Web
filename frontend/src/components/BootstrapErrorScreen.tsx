/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import React from 'react';
import {FloodilkaIcon} from '~/components/icons/FloodilkaIcon';
import {Button} from '~/components/uikit/Button/Button';
import AppStorage from '~/lib/AppStorage';
import styles from './ErrorFallback.module.css';

interface BootstrapErrorScreenProps {
	error?: Error;
}

export const BootstrapErrorScreen: React.FC<BootstrapErrorScreenProps> = ({error}) => {
	const handleRetry = React.useCallback(() => {
		window.location.reload();
	}, []);

	const handleReset = React.useCallback(() => {
		AppStorage.clear();
		window.location.reload();
	}, []);

	return (
		<div className={styles.errorFallbackContainer}>
			<FloodilkaIcon className={styles.errorFallbackIcon} />
			<div className={styles.errorFallbackContent}>
				<h1 className={styles.errorFallbackTitle}>
					<Trans>Failed to Start</Trans>
				</h1>
				<p className={styles.errorFallbackDescription}>
					<Trans>Флудилка failed to start properly. This could be due to corrupted data or a temporary issue.</Trans>
				</p>
				{error && (
					<p className={styles.errorFallbackDescription} style={{fontSize: '0.875rem', opacity: 0.8}}>
						{error.message}
					</p>
				)}
				<p className={styles.errorFallbackDescription}>
					<Trans>Try again later or contact support.</Trans>
				</p>
			</div>
			<div className={styles.errorFallbackActions}>
				<Button onClick={handleRetry}>
					<Trans>Try Again</Trans>
				</Button>
				<Button onClick={handleReset} variant="danger-primary">
					<Trans>Reset App Data</Trans>
				</Button>
			</div>
		</div>
	);
};
