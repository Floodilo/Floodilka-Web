/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Icon} from '@phosphor-icons/react';
import React from 'react';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {TooltipWithKeybind} from '~/components/uikit/KeybindHint/KeybindHint';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import {useMergeRefs} from '~/hooks/useMergeRefs';
import type {KeybindAction} from '~/stores/KeybindStore';
import styles from '../ChannelHeader.module.css';

export interface ChannelHeaderIconProps {
	icon: Icon;
	label: string;
	isSelected?: boolean;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	keybindAction?: KeybindAction;
}

export const ChannelHeaderIcon = React.forwardRef<HTMLButtonElement, ChannelHeaderIconProps>((props, ref) => {
	const {icon: Icon, label, isSelected = false, onClick, disabled = false, keybindAction, ...rest} = props;
	const buttonRef = React.useRef<HTMLButtonElement | null>(null);
	const mergedRef = useMergeRefs([ref, buttonRef]);

	const tooltipText = React.useCallback(
		() => <TooltipWithKeybind label={label} action={keybindAction} />,
		[label, keybindAction],
	);

	const button = (
		<FocusRing offset={-2} enabled={!disabled}>
			<button
				{...rest}
				ref={mergedRef}
				type="button"
				className={isSelected ? styles.iconButtonSelected : styles.iconButtonDefault}
				aria-label={label}
				onClick={disabled ? undefined : onClick}
				disabled={disabled}
				style={{opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer'}}
			>
				<Icon className={styles.buttonIcon} />
			</button>
		</FocusRing>
	);

	if (disabled) {
		return (
			<Tooltip text={tooltipText} position="bottom">
				<div style={{display: 'inline-flex'}}>{button}</div>
			</Tooltip>
		);
	}

	return (
		<Tooltip text={tooltipText} position="bottom">
			{button}
		</Tooltip>
	);
});

ChannelHeaderIcon.displayName = 'ChannelHeaderIcon';
