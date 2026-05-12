/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Icon, IconProps} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import React from 'react';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {TooltipWithKeybind} from '~/components/uikit/KeybindHint/KeybindHint';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import type {KeybindAction, KeyCombo} from '~/stores/KeybindStore';
import styles from './TextareaButton.module.css';

export type TextareaButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	icon: Icon;
	label: string;
	isSelected?: boolean;
	compact?: boolean;
	iconProps?: Partial<IconProps>;
	keybindAction?: KeybindAction;
	keybindCombo?: KeyCombo;
};

export const TextareaButton = React.forwardRef<HTMLButtonElement, TextareaButtonProps>(
	(
		{
			icon: Icon,
			label,
			onClick,
			disabled,
			isSelected,
			compact,
			iconProps,
			className,
			keybindAction,
			keybindCombo,
			...props
		},
		ref,
	) => {
		const button = (
			<button
				{...props}
				ref={ref}
				type="button"
				aria-label={label}
				disabled={disabled}
				onClick={onClick}
				className={clsx(compact ? styles.buttonCompact : styles.button, isSelected && styles.selected, className)}
			>
				<Icon className={styles.icon} {...iconProps} />
			</button>
		);

		const tooltipText = React.useCallback(
			() => <TooltipWithKeybind label={label} action={keybindAction} combo={keybindCombo} />,
			[label, keybindAction, keybindCombo],
		);

		return (
			<Tooltip text={tooltipText} position="top">
				<FocusRing offset={-2} enabled={!disabled}>
					{button}
				</FocusRing>
			</Tooltip>
		);
	},
);

TextareaButton.displayName = 'TextareaButton';
