/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import styles from '../LandingPage.module.css';

interface DownloadInfo {
	icon: string;
	iconAlt: string;
	label: string;
}

interface LandingCTAProps {
	downloadInfo: DownloadInfo;
	onDownload: () => void;
}

export const LandingCTA = ({downloadInfo, onDownload}: LandingCTAProps) => {
	return (
		<div className={styles.curtain}>
			<section className={styles.cta_block}>
				<div className={styles.txt_and_butt}>
					<h1 className={styles.txt_download}>
						Убедись во всем сам. Скачай приложение и начни общаться уже сейчас
					</h1>
					<button
						className={`${styles.btn} ${styles['btn--primary']} ${styles['ubuntu-medium']}`}
						onClick={onDownload}
					>
						<img src={downloadInfo.icon} alt={downloadInfo.iconAlt} className={styles.btn__icon} />
						<span className={styles.btn__label}>{downloadInfo.label}</span>
					</button>
					<div className={styles.floodilka_figura}>
						<img src="/icons/floodilka.svg" alt="Логотип Флудилка - декоративный элемент" />
					</div>
				</div>
			</section>
		</div>
	);
};
