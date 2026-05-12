/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {PauseIcon, PlayIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import type React from 'react';
import {useCallback} from 'react';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import styles from './MediaPlayButton.module.css';

export interface MediaPlayButtonProps {
	isPlaying: boolean;
	onToggle: () => void;
	size?: 'small' | 'medium' | 'large' | 'xlarge';
	iconSize?: number;
	showTooltip?: boolean;
	className?: string;
	overlay?: boolean;
	disabled?: boolean;
}

const SIZE_MAP = {
	small: 16,
	medium: 20,
	large: 24,
	xlarge: 32,
};

export function MediaPlayButton({
	isPlaying,
	onToggle,
	size = 'medium',
	iconSize,
	showTooltip = true,
	className,
	overlay = false,
	disabled = false,
}: MediaPlayButtonProps) {
	const {t} = useLingui();
	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			if (!disabled) {
				onToggle();
			}
		},
		[onToggle, disabled],
	);

	const actualIconSize = iconSize ?? SIZE_MAP[size];
	const label = isPlaying ? t`Pause` : t`Play`;

	const Icon = isPlaying ? PauseIcon : PlayIcon;

	const button = (
		<button
			type="button"
			onClick={handleClick}
			className={clsx(styles.button, styles[size], overlay && styles.overlay, className)}
			aria-label={label}
			disabled={disabled}
		>
			<Icon size={actualIconSize} weight="fill" />
		</button>
	);

	if (showTooltip && !overlay) {
		return (
			<Tooltip text={label} position="top">
				{button}
			</Tooltip>
		);
	}

	return button;
}
