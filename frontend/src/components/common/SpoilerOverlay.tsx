/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {clsx} from 'clsx';
import type {FC, ReactNode} from 'react';
import styles from './SpoilerOverlay.module.css';

interface SpoilerOverlayProps {
	hidden: boolean;
	onReveal: () => void;
	children: ReactNode;
	label?: string;
	inline?: boolean;
	className?: string;
}

export const SpoilerOverlay: FC<SpoilerOverlayProps> = ({hidden, onReveal, children, label, inline, className}) => {
	const {t} = useLingui();
	const ariaLabel = label ?? t`Reveal spoiler`;

	return (
		<div className={clsx(styles.container, inline && styles.inline, hidden && styles.hidden, className)}>
			<div className={styles.content} aria-hidden={hidden}>
				{children}
			</div>
			{hidden && (
				<button type="button" className={styles.overlayButton} onClick={onReveal} aria-label={ariaLabel}>
					<span className={styles.overlayLabel}>{label ?? t`Spoiler`}</span>
				</button>
			)}
		</div>
	);
};
