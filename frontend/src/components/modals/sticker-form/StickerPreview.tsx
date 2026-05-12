/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import styles from './StickerPreview.module.css';

interface StickerPreviewProps {
	imageUrl: string;
	altText: string;
}

export const StickerPreview = observer(function StickerPreview({imageUrl, altText}: StickerPreviewProps) {
	return (
		<div className={styles.container}>
			<div className={styles.title}>
				<Trans>Preview</Trans>
			</div>
			<div className={styles.previewContainer}>
				<div className={styles.previewItem}>
					<div className={`${styles.previewBox} ${styles.darkBackground}`}>
						<img src={imageUrl} alt={`${altText} - Dark theme preview`} className={styles.previewImage} />
					</div>
					<span className={styles.label}>
						<Trans>Dark</Trans>
					</span>
				</div>
				<div className={styles.previewItem}>
					<div className={`${styles.previewBox} ${styles.lightBackground}`}>
						<img src={imageUrl} alt={`${altText} - Light theme preview`} className={styles.previewImage} />
					</div>
					<span className={styles.label}>
						<Trans>Light</Trans>
					</span>
				</div>
			</div>
		</div>
	);
});
