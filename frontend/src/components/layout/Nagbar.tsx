/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {XIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {NativeDragRegion} from '~/components/layout/NativeDragRegion';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import styles from './Nagbar.module.css';

interface NagbarProps {
	isMobile: boolean;
	backgroundColor: string;
	textColor: string;
	children: React.ReactNode;
	onDismiss?: () => void;
	dismissible?: boolean;
}

export const Nagbar = observer(
	({isMobile, backgroundColor, textColor, children, onDismiss, dismissible = false}: NagbarProps) => {
		const showDismissButton = dismissible && onDismiss && !isMobile;

		return (
			<NativeDragRegion
				className={clsx(
					styles.nagbar,
					isMobile ? styles.nagbarMobile : styles.nagbarDesktop,
					showDismissButton && styles.nagbarDismissible,
				)}
				style={
					{
						backgroundColor,
						color: textColor,
						'--nagbar-background-color': backgroundColor,
					} as React.CSSProperties
				}
			>
				{children}
				{showDismissButton && (
					<FocusRing>
						<button
							type="button"
							className={styles.dismissButton}
							style={{color: textColor}}
							aria-label="Close"
							onClick={onDismiss}
						>
							<XIcon weight="regular" className={styles.dismissIcon} />
						</button>
					</FocusRing>
				)}
			</NativeDragRegion>
		);
	},
);
