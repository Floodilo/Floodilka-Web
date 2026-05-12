/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import React from 'react';
import styles from './Divider.module.css';

export const Divider = React.memo(
	React.forwardRef<
		HTMLDivElement,
		{
			red?: boolean;
			children?: React.ReactNode;
			spacing?: number;
			isDate?: boolean;
			style?: React.CSSProperties;
			className?: string;
			id?: string;
			onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
		}
	>(({red = false, children, spacing = 8, isDate = false, style, ...rest}, ref) => {
		if (red) {
			if (isDate && children) {
				return (
					<div
						ref={ref}
						className={`${styles.unreadContainer} ${styles.unreadDate}`}
						style={{marginTop: `${spacing}px`, marginBottom: `${spacing}px`, ...style}}
						{...rest}
					>
						<div className={styles.unreadLine} />
						<span className={styles.dateWithUnreadText}>{children}</span>
						<div className={styles.unreadLine} />
						<span className={styles.unreadBadge}>
							<Trans>New</Trans>
						</span>
					</div>
				);
			}

			return (
				<div ref={ref} className={styles.unreadContainer} style={{...style}} {...rest}>
					<div className={styles.unreadLine} />
					<span className={styles.unreadBadge}>{children || <Trans>New</Trans>}</span>
				</div>
			);
		}

		return (
			<div
				ref={ref}
				className={styles.container}
				style={{marginTop: `${spacing}px`, marginBottom: `${spacing}px`, ...style}}
				{...rest}
			>
				<div className={styles.line} />
				{children && <span className={styles.text}>{children}</span>}
				<div className={styles.line} />
			</div>
		);
	}),
);
