/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import clsx from 'clsx';
import type {ReactNode} from 'react';
import authLayoutStyles from '~/components/layout/AuthLayout.module.css';
import floodilkaLogo from '~/images/floodilka-logo-color.png';
import FloodilkaWordmark from '~/images/floodilka-wordmark.svg?react';
import styles from './AuthCardContainer.module.css';

export interface AuthCardContainerProps {
	showLogoSide?: boolean;
	children: ReactNode;
	isInert?: boolean;
	className?: string;
}

export function AuthCardContainer({showLogoSide = true, children, isInert = false, className}: AuthCardContainerProps) {
	return (
		<div className={clsx(authLayoutStyles.cardContainer, className)}>
			<div className={clsx(authLayoutStyles.card, !showLogoSide && authLayoutStyles.cardSingle)}>
				{showLogoSide && (
					<div className={authLayoutStyles.logoSide}>
						<img src={floodilkaLogo} alt="Floodilka" className={authLayoutStyles.logo} />
						<FloodilkaWordmark className={authLayoutStyles.wordmark} />
					</div>
				)}
				<div className={clsx(authLayoutStyles.formSide, !showLogoSide && authLayoutStyles.formSideSingle)}>
					{isInert ? <div className={styles.inertOverlay}>{children}</div> : children}
				</div>
			</div>
		</div>
	);
}
