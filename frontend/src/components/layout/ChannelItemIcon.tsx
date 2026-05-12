/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Icon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import {stopPropagationOnEnterSpace} from '~/utils/KeyboardUtils';
import styles from './ChannelItemIcon.module.css';

interface ChannelItemIconProps {
	icon: Icon;
	label: string;
	onClick?: () => void;
	className?: string;
	selected?: boolean;
}

export const ChannelItemIcon = observer(
	({icon: Icon, label, onClick, className, selected = false}: ChannelItemIconProps) => {
		return (
			<Tooltip text={label}>
				<FocusRing offset={-2} ringClassName={styles.iconFocusRing}>
					<button
						type="button"
						className={clsx(
							styles.iconButton,
							selected ? styles.iconButtonSelected : styles.iconButtonDefault,
							className,
						)}
						aria-label={label}
						onClick={(e) => {
							e.stopPropagation();
							onClick?.();
						}}
						onKeyDown={stopPropagationOnEnterSpace}
					>
						<Icon className={styles.icon} />
					</button>
				</FocusRing>
			</Tooltip>
		);
	},
);
