/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {Button} from '~/components/uikit/Button/Button';
import {useMicTest} from '../hooks/useMicTest';
import styles from './MicTestSection.module.css';

interface MicTestSectionProps {
	settings: {
		inputDeviceId: string;
		outputDeviceId: string;
		inputVolume: number;
		outputVolume: number;
	};
}

export const MicTestSection: React.FC<MicTestSectionProps> = observer(({settings}) => {
	const {t} = useLingui();
	const {isTesting, micLevel, peakLevel, start, stop} = useMicTest(settings);

	const getMicLevelPercentage = () => {
		if (!Number.isFinite(micLevel)) return 0;

		const minDb = -60;
		const maxDb = 0;
		const clampedLevel = Math.max(minDb, Math.min(maxDb, micLevel));
		const percentage = ((clampedLevel - minDb) / (maxDb - minDb)) * 100;
		return Math.round(percentage);
	};

	const getPeakLevelPercentage = () => {
		if (!Number.isFinite(peakLevel)) return 0;

		const minDb = -60;
		const maxDb = 0;
		const clampedLevel = Math.max(minDb, Math.min(maxDb, peakLevel));
		const percentage = ((clampedLevel - minDb) / (maxDb - minDb)) * 100;
		return Math.round(percentage);
	};

	const getMicLevelColor = () => {
		const percentage = getMicLevelPercentage();
		if (percentage < 20) return 'hsl(0, 0%, 40%)';
		if (percentage < 60) return 'hsl(120, 60%, 50%)';
		if (percentage < 85) return 'hsl(45, 100%, 50%)';
		return 'hsl(0, 60%, 50%)';
	};

	const getMicStatusText = () => {
		if (!isTesting) return '';
		if (!Number.isFinite(micLevel)) return t`No Input`;

		const percentage = getMicLevelPercentage();
		if (percentage < 20) return t`Too Quiet`;
		if (percentage < 60) return t`Good`;
		if (percentage < 85) return t`Optimal`;
		return t`Too Loud`;
	};

	return (
		<div>
			<div className={styles.label}>
				<Trans>Mic Test</Trans>
			</div>
			<div className={styles.content}>
				<Button
					variant="primary"
					fitContainer={false}
					className={styles.actionButton}
					onClick={isTesting ? stop : start}
				>
					{isTesting ? <Trans>Stop Test</Trans> : <Trans>Start Mic Test</Trans>}
				</Button>

				{isTesting && (
					<div className={styles.testInfo}>
						<div className={styles.levelInfo}>
							<span className={styles.levelLabel}>
								<Trans>Input Level</Trans>
							</span>
							<span
								className={clsx(
									styles.levelStatus,
									getMicLevelPercentage() < 20
										? styles.levelQuiet
										: getMicLevelPercentage() < 60
											? styles.levelGood
											: getMicLevelPercentage() < 85
												? styles.levelOptimal
												: styles.levelLoud,
								)}
							>
								{getMicStatusText()}
							</span>
						</div>

						<div className={styles.meterContainer}>
							<div
								className={styles.meterBar}
								style={{
									width: `${getMicLevelPercentage()}%`,
									backgroundColor: getMicLevelColor(),
								}}
							/>
							<div
								className={styles.meterPeak}
								style={{
									left: `${getPeakLevelPercentage()}%`,
								}}
							/>
						</div>

						<p className={styles.helpText}>
							<Trans>
								Speak normally into your microphone. You should hear yourself through your speakers. The level should
								stay in the green "Good" or yellow "Optimal" range.
							</Trans>
						</p>
					</div>
				)}
			</div>
		</div>
	);
});
