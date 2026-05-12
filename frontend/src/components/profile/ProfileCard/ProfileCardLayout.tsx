/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import styles from './ProfileCardLayout.module.css';

interface ProfileCardLayoutProps {
	showPreviewLabel?: boolean;
	hoverRef?: (instance: HTMLDivElement | null) => void;
	children: React.ReactNode;
}

export const ProfileCardLayout: React.FC<ProfileCardLayoutProps> = observer(
	({showPreviewLabel = false, hoverRef, children}) => {
		return (
			<div>
				{showPreviewLabel && (
					<div className={styles.previewLabel}>
						<Trans>Profile Preview</Trans>
					</div>
				)}

				<div ref={hoverRef} className={styles.profileCard}>
					{children}
				</div>
			</div>
		);
	},
);
