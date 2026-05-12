/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import type React from 'react';
import styles from './EmbedCard.module.css';

export interface EmbedCardProps {
	splashURL?: string | null;
	splashAspectRatio?: number;
	icon: React.ReactNode;
	title: React.ReactNode;
	subtitle?: React.ReactNode;
	body?: React.ReactNode;
	footer: React.ReactNode;
	className?: string;
	headerClassName?: string;
}

export const EmbedCard = ({
	splashURL,
	splashAspectRatio,
	icon,
	title,
	subtitle,
	body,
	footer,
	className,
	headerClassName,
}: EmbedCardProps) => {
	const hasSplashAspectRatio = splashAspectRatio != null && Number.isFinite(splashAspectRatio) && splashAspectRatio > 0;
	const hasSplash = splashURL != null && splashURL !== '';

	return (
		<div className={clsx(styles.wrapper, className)}>
			{hasSplash ? (
				<div className={styles.splashWrapper}>
					<div
						className={styles.splash}
						style={
							{
								['--embed-splash-url' as any]: `url(${splashURL})`,
								...(hasSplashAspectRatio ? {height: 'auto', aspectRatio: splashAspectRatio as number} : {}),
							} as React.CSSProperties
						}
					/>
				</div>
			) : null}

			<div className={styles.grid}>
				<div className={styles.iconSlot}>{icon}</div>

				<div className={styles.content}>
					<div className={clsx(styles.header, headerClassName)}>
						<div className={styles.titleRow}>{title}</div>
						{subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}
					</div>

					{body ? <div className={styles.body}>{body}</div> : null}
				</div>
			</div>

			<div className={styles.divider}>{footer}</div>
		</div>
	);
};

interface SkeletonProps {
	className?: string;
	style?: React.CSSProperties;
}

const Skeleton = ({className, style}: SkeletonProps) => (
	<div className={clsx(styles.skeleton, className)} style={style} />
);

export const EmbedSkeletonCircle = ({className}: SkeletonProps) => (
	<Skeleton className={clsx(styles.skeletonCircle, className)} />
);

export const EmbedSkeletonTitle = ({className}: SkeletonProps) => (
	<Skeleton className={clsx(styles.skeletonTitle, className)} />
);

export const EmbedSkeletonSubtitle = ({className}: SkeletonProps) => (
	<Skeleton className={clsx(styles.skeletonSubtitle, className)} />
);

export const EmbedSkeletonIcon = ({className}: SkeletonProps) => (
	<Skeleton className={clsx(styles.skeletonIcon, className)} />
);

export const EmbedSkeletonDot = ({className}: SkeletonProps) => (
	<Skeleton className={clsx(styles.skeletonDot, className)} />
);

export const EmbedSkeletonStatShort = ({className}: SkeletonProps) => (
	<Skeleton className={clsx(styles.skeletonStat, styles.skeletonStatShort, className)} />
);

export const EmbedSkeletonStatLong = ({className}: SkeletonProps) => (
	<Skeleton className={clsx(styles.skeletonStat, styles.skeletonStatLong, className)} />
);

export const EmbedSkeletonButton = ({className}: SkeletonProps) => (
	<Skeleton className={clsx(styles.skeletonButton, className)} />
);
