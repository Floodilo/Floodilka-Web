/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import styles from './ActionButton.module.css';

export const ActionButton = observer(
	({
		tooltip,
		onClick,
		className,
		danger = false,
		children,
	}: {
		tooltip: string;
		onClick: (e: React.MouseEvent) => void;
		className?: string;
		danger?: boolean;
		children: React.ReactNode;
	}) => (
		<Tooltip text={tooltip} position="top">
			<FocusRing>
				<button
					type="button"
					className={clsx(styles.button, danger && styles.danger, !danger && className)}
					onClick={(e) => {
						e.stopPropagation();
						onClick(e);
					}}
				>
					{children}
				</button>
			</FocusRing>
		</Tooltip>
	),
);
