/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {AnimatePresence, motion} from 'framer-motion';
import {observer} from 'mobx-react-lite';
import React from 'react';
import ConnectionStore from '~/stores/ConnectionStore';
import DeveloperOptionsStore from '~/stores/DeveloperOptionsStore';
import InitializationStore from '~/stores/InitializationStore';
import {NativeDragRegion} from './NativeDragRegion';
import styles from './SplashScreen.module.css';

const SPLASH_SCREEN_DELAY = 10000;

export const SplashScreen = observer(() => {
	const shouldBypass = DeveloperOptionsStore.bypassSplashScreen;
	const connected = ConnectionStore.isConnected;
	const isInitialized = InitializationStore.canNavigateToProtectedRoutes;
	const [showSplash, setShowSplash] = React.useState(true);

	React.useEffect(() => {
		if (connected && isInitialized) {
			setShowSplash(false);
			return;
		}

		const timer = setTimeout(() => setShowSplash(true), SPLASH_SCREEN_DELAY);
		return () => clearTimeout(timer);
	}, [connected, isInitialized]);

	if (shouldBypass) return null;
	return <AnimatePresence initial={false}>{showSplash && <SplashScreenContent />}</AnimatePresence>;
});

const SplashScreenContent = observer(() => {
	return (
		<motion.div
			initial={{opacity: 0}}
			animate={{opacity: 1}}
			exit={{opacity: 0}}
			transition={{duration: 0.3}}
			className={styles.splashOverlay}
		>
			<NativeDragRegion className={styles.topDragRegion} />
			<div className={styles.splashContent}>
				<div className={styles.spinnerContainer}>
					<div className={styles.spinner}>
						<div className={styles.spinnerRing} />
						<div className={styles.spinnerLogo}>
							<img src="/icons/logo_nobg.png" alt="Флудилка" />
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
});
