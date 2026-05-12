/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import React from 'react';
import {FrameContext, type FrameSides} from './FrameContext';
import styles from './OutlineFrame.module.css';

interface OutlineFrameProps {
	sidebarDivider?: boolean;
	hideTopBorder?: boolean;
	sides?: FrameSides;
	nagbar?: React.ReactNode;
	topBanner?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}

export const OutlineFrame: React.FC<OutlineFrameProps> = ({
	sidebarDivider = false,
	hideTopBorder = false,
	sides,
	topBanner,
	nagbar,
	children,
	className,
}) => {
	const ctxSides = React.useMemo<FrameSides>(() => {
		return {
			top: !hideTopBorder,
			right: true,
			bottom: true,
			left: true,
			...sides,
		};
	}, [hideTopBorder, sides]);

	const showTopBorder = ctxSides.top !== false;
	const frameStyle = React.useMemo<React.CSSProperties>(() => {
		return {
			borderLeft: ctxSides.left === false ? 'none' : undefined,
			borderRight: ctxSides.right === false ? 'none' : undefined,
			borderBottom: ctxSides.bottom === false ? 'none' : undefined,
		};
	}, [ctxSides.bottom, ctxSides.left, ctxSides.right]);

	return (
		<div
			className={clsx(
				styles.frame,
				showTopBorder && styles.frameShowTop,
				!showTopBorder && styles.frameHideTop,
				className,
			)}
			style={frameStyle}
		>
			<FrameContext.Provider value={ctxSides}>
				{topBanner}
				{nagbar}
				<div className={styles.contentWrapper}>
					{sidebarDivider && <div className={styles.divider} aria-hidden />}
					<div className={styles.body}>{children}</div>
				</div>
			</FrameContext.Provider>
		</div>
	);
};
