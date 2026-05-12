/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type {FC, ReactNode} from 'react';
import styles from './MediaButtons.module.css';

interface OverlayPlayButtonProps {
	onClick: (event: React.MouseEvent) => void;
	icon: ReactNode;
	ariaLabel?: string;
}

export const OverlayPlayButton: FC<OverlayPlayButtonProps> = observer(({onClick, icon, ariaLabel}) => (
	<button type="button" onClick={onClick} className={styles.overlayButtonGroup} aria-label={ariaLabel}>
		<div className={`${styles.overlayButton} ${styles.overlayButtonHover}`}>{icon}</div>
	</button>
));

interface OverlayActionButtonProps {
	onClick: (event: React.MouseEvent) => void;
	icon: ReactNode;
	ariaLabel?: string;
}

export const OverlayActionButton: FC<OverlayActionButtonProps> = observer(({onClick, icon, ariaLabel}) => (
	<button type="button" onClick={onClick} className={styles.overlayButtonGroup} aria-label={ariaLabel}>
		<div className={`${styles.overlayButton} ${styles.overlayButtonHover}`}>{icon}</div>
	</button>
));
