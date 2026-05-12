/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {PictureInPictureIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import type React from 'react';
import {useCallback} from 'react';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import styles from './MediaPlayButton.module.css';

export interface MediaPipButtonProps {
	isPiP: boolean;
	supportsPiP?: boolean;
	onToggle: () => void;
	iconSize?: number;
	size?: 'small' | 'medium' | 'large';
	showTooltip?: boolean;
	className?: string;
}

export function MediaPipButton({
	isPiP,
	supportsPiP = true,
	onToggle,
	iconSize = 20,
	size = 'medium',
	showTooltip = true,
	className,
}: MediaPipButtonProps) {
	const {t} = useLingui();
	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			onToggle();
		},
		[onToggle],
	);

	if (!supportsPiP) {
		return null;
	}

	const label = isPiP ? t`Exit picture-in-picture` : t`Enter picture-in-picture`;

	const button = (
		<button
			type="button"
			onClick={handleClick}
			className={clsx(styles.button, styles[size], className)}
			aria-label={label}
		>
			<PictureInPictureIcon size={iconSize} weight={isPiP ? 'fill' : 'bold'} />
		</button>
	);

	if (showTooltip) {
		return (
			<Tooltip text={label} position="top">
				{button}
			</Tooltip>
		);
	}

	return button;
}
