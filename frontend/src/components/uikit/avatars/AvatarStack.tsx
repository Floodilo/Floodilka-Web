/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import React from 'react';
import styles from './AvatarStack.module.css';

export interface AvatarStackProps {
	children: React.ReactNode;
	size?: number;
	maxVisible?: number;
	className?: string;
}

export const AvatarStack: React.FC<AvatarStackProps> = observer(({children, size = 28, maxVisible = 3, className}) => {
	const childArray = React.Children.toArray(children).filter(Boolean);
	const totalCount = childArray.length;

	const visibleChildren = childArray.slice(0, maxVisible);
	const remainingCount = Math.max(0, totalCount - maxVisible);
	const computedOutline = Math.min(3, Math.max(1, Math.round(size * 0.07)));
	const overlap = Math.round(-0.35 * size);

	const cssVars = {
		'--avatar-size': `${size}px`,
		'--avatar-overlap': `${overlap}px`,
		'--avatar-outline': `${computedOutline}px`,
	} as React.CSSProperties;

	return (
		<div className={clsx(styles.container, className)} style={cssVars}>
			{visibleChildren.map((child, index) => (
				<div
					key={index}
					className={clsx(styles.avatar, (index < visibleChildren.length - 1 || remainingCount > 0) && styles.withMask)}
				>
					{child}
				</div>
			))}
			{remainingCount > 0 && <div className={styles.remainingCount}>+{remainingCount}</div>}
		</div>
	);
});
