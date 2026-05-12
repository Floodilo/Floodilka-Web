/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {motion} from 'framer-motion';
import type React from 'react';
import {GuildSplashCardAlignment} from '~/Constants';
import styles from '~/components/layout/AuthLayout.module.css';

const getSplashAlignmentStyles = (
	alignment: (typeof GuildSplashCardAlignment)[keyof typeof GuildSplashCardAlignment],
) => {
	switch (alignment) {
		case GuildSplashCardAlignment.LEFT:
			return {transformOrigin: 'bottom left', objectPosition: 'left bottom'};
		case GuildSplashCardAlignment.RIGHT:
			return {transformOrigin: 'bottom right', objectPosition: 'right bottom'};
		default:
			return {transformOrigin: 'bottom center', objectPosition: 'center bottom'};
	}
};

export interface AuthBackgroundProps {
	splashUrl: string | null;
	splashLoaded: boolean;
	splashDimensions?: {width: number; height: number} | null;
	splashScale?: number | null;
	patternReady: boolean;
	patternImageUrl: string;
	className?: string;
	useFullCover?: boolean;
	splashAlignment?: (typeof GuildSplashCardAlignment)[keyof typeof GuildSplashCardAlignment];
}

export const AuthBackground: React.FC<AuthBackgroundProps> = ({
	splashUrl,
	splashLoaded,
	splashDimensions,
	splashScale,
	patternReady,
	patternImageUrl,
	className,
	useFullCover = false,
	splashAlignment = GuildSplashCardAlignment.CENTER,
}) => {
	const shouldShowSplash = splashUrl && splashDimensions && (useFullCover || splashScale);
	const {transformOrigin, objectPosition} = getSplashAlignmentStyles(splashAlignment);

	if (shouldShowSplash) {
		if (useFullCover) {
			return (
				<div className={className}>
					<motion.div
						initial={{opacity: 0}}
						animate={{opacity: splashLoaded ? 1 : 0}}
						transition={{duration: 0.5, ease: 'easeInOut'}}
						style={{position: 'absolute', inset: 0}}
					>
						<img
							src={splashUrl}
							alt=""
							style={{
								position: 'absolute',
								inset: 0,
								width: '100%',
								height: '100%',
								objectFit: 'cover',
								objectPosition,
							}}
						/>
						<div className={styles.splashOverlay} />
					</motion.div>
				</div>
			);
		}

		return (
			<div className={styles.rightSplit}>
				<motion.div
					className={styles.splashImage}
					initial={{opacity: 0}}
					animate={{opacity: splashLoaded ? 1 : 0}}
					transition={{duration: 0.5, ease: 'easeInOut'}}
					style={{
						width: splashDimensions.width,
						height: splashDimensions.height,
						transform: `scale(${splashScale})`,
						transformOrigin,
					}}
				>
					<img
						src={splashUrl}
						alt=""
						width={splashDimensions.width}
						height={splashDimensions.height}
						style={{
							position: 'absolute',
							left: 0,
							top: 0,
							width: '100%',
							height: '100%',
							objectFit: 'cover',
							objectPosition,
						}}
					/>
					<div className={styles.splashOverlay} />
				</motion.div>
			</div>
		);
	}

	if (patternReady) {
		return (
			<div
				className={className || styles.patternHost}
				style={{backgroundImage: `url(${patternImageUrl})`}}
				aria-hidden
			/>
		);
	}

	return null;
};
