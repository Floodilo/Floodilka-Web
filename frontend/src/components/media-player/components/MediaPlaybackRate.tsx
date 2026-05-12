/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {clsx} from 'clsx';
import type React from 'react';
import {useCallback, useMemo} from 'react';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import {AUDIO_PLAYBACK_RATES, VIDEO_PLAYBACK_RATES} from '../utils/mediaConstants';
import styles from './MediaPlaybackRate.module.css';

export interface MediaPlaybackRateProps {
	rate: number;
	onRateChange: (rate: number) => void;
	rates?: ReadonlyArray<number>;
	isAudio?: boolean;
	size?: 'small' | 'medium' | 'large';
	showTooltip?: boolean;
	className?: string;
}

function formatRate(rate: number): string {
	if (rate === 1) return '1x';
	if (Number.isInteger(rate)) return `${rate}x`;
	return `${rate}x`;
}

export function MediaPlaybackRate({
	rate,
	onRateChange,
	rates,
	isAudio = false,
	size = 'medium',
	showTooltip = true,
	className,
}: MediaPlaybackRateProps) {
	const {t} = useLingui();
	const availableRates = useMemo(() => {
		if (rates) return rates;
		return isAudio ? AUDIO_PLAYBACK_RATES : VIDEO_PLAYBACK_RATES;
	}, [rates, isAudio]);

	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();

			const currentIndex = availableRates.indexOf(rate);
			const nextIndex = (currentIndex + 1) % availableRates.length;
			onRateChange(availableRates[nextIndex]);
		},
		[rate, availableRates, onRateChange],
	);

	const isActive = rate !== 1;
	const formattedRate = formatRate(rate);
	const label = t`Playback speed: ${formattedRate}`;

	const button = (
		<button
			type="button"
			onClick={handleClick}
			className={clsx(styles.button, styles[size], isActive && styles.active, className)}
			aria-label={label}
		>
			{formatRate(rate)}
		</button>
	);

	if (showTooltip) {
		return (
			<Tooltip text={t`Playback speed`} position="top">
				{button}
			</Tooltip>
		);
	}

	return button;
}
