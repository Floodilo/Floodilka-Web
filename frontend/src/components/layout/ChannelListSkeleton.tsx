/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type React from 'react';
import styles from './GuildNavbarSkeleton.module.css';

export const ChannelListSkeleton: React.FC = () => {
	return (
		<div className={styles.skeletonContent}>
			<div className={styles.skeletonCategory}>
				<div className={styles.skeletonCategoryPill} />
			</div>
			<div className={styles.skeletonChannel}>
				<div className={styles.skeletonChannelPill} />
			</div>
			<div className={styles.skeletonChannel}>
				<div className={styles.skeletonChannelPill} />
			</div>
			<div className={styles.skeletonChannel}>
				<div className={styles.skeletonChannelPill} />
			</div>

			<div className={styles.skeletonCategory}>
				<div className={styles.skeletonCategoryPill} />
			</div>
			<div className={styles.skeletonChannel}>
				<div className={styles.skeletonChannelPill} />
			</div>
			<div className={styles.skeletonChannel}>
				<div className={styles.skeletonChannelPill} />
			</div>

			<div className={styles.skeletonCategory}>
				<div className={styles.skeletonCategoryPill} />
			</div>
			<div className={styles.skeletonChannel}>
				<div className={styles.skeletonChannelPill} />
			</div>
			<div className={styles.skeletonChannel}>
				<div className={styles.skeletonChannelPill} />
			</div>
			<div className={styles.skeletonChannel}>
				<div className={styles.skeletonChannelPill} />
			</div>
			<div className={styles.skeletonChannel}>
				<div className={styles.skeletonChannelPill} />
			</div>
		</div>
	);
};
