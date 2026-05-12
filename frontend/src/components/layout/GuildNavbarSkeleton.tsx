/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import styles from './GuildNavbarSkeleton.module.css';

export const GuildNavbarSkeleton = observer(() => {
	const mobileLayout = MobileLayoutStore;

	return (
		<div className={clsx(styles.skeletonContainer, mobileLayout.enabled && styles.skeletonContainerMobile)}>
			<div className={styles.skeletonHeader}>
				<div className={styles.skeletonHeaderPill} />
			</div>

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
		</div>
	);
});
