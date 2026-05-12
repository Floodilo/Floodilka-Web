/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {SealCheckIcon} from '@phosphor-icons/react';
import type {ReactNode} from 'react';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import styles from './AuthPageStyles.module.css';

interface AuthPageHeaderStatProps {
	value: string | number;
	dot?: 'online' | 'offline';
}

interface AuthPageHeaderProps {
	icon: ReactNode;
	title: string;
	subtitle: string;
	verified?: boolean;
	stats?: Array<AuthPageHeaderStatProps>;
}

export function AuthPageHeader({icon, title, subtitle, verified, stats}: AuthPageHeaderProps) {
	const {t} = useLingui();
	return (
		<div className={styles.entityHeader}>
			{icon}
			<div className={styles.entityDetails}>
				<p className={styles.entityText}>{title}</p>
				<div className={styles.entityTitleWrapper}>
					<h2 className={styles.entityTitle}>{subtitle}</h2>
					{verified && (
						<Tooltip text={t`Verified Community`} position="top">
							<SealCheckIcon className={styles.verifiedIcon} />
						</Tooltip>
					)}
				</div>
				{stats && stats.length > 0 && (
					<div className={styles.entityStats}>
						{stats.map((stat, index) => (
							<div key={index} className={styles.entityStat}>
								{stat.dot === 'online' && <div className={styles.onlineDot} />}
								{stat.dot === 'offline' && <div className={styles.offlineDot} />}
								<span className={styles.statText}>{stat.value}</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
