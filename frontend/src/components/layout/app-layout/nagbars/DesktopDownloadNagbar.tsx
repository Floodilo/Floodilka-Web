/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {AndroidLogoIcon, AppleLogoIcon, WindowsLogoIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import * as NagbarActionCreators from '~/actions/NagbarActionCreators';
import {Nagbar} from '~/components/layout/Nagbar';
import {NagbarButton} from '~/components/layout/NagbarButton';
import {NagbarContent} from '~/components/layout/NagbarContent';
import {openExternalUrl} from '~/utils/NativeUtils';
import styles from './DesktopDownloadNagbar.module.css';

export const DesktopDownloadNagbar = observer(({isMobile}: {isMobile: boolean}) => {
	const handleDownload = () => {
		openExternalUrl(`${window.location.origin}/download`);
	};

	const handleDismiss = () => {
		NagbarActionCreators.dismissNagbar('desktopDownloadDismissed');
	};

	return (
		<Nagbar
			isMobile={isMobile}
			backgroundColor="var(--brand-primary)"
			textColor="var(--text-on-brand-primary)"
			dismissible
			onDismiss={handleDismiss}
		>
			<NagbarContent
				isMobile={isMobile}
				message={<Trans>Get the Floodilka desktop app for system-wide push-to-talk and a few other goodies.</Trans>}
				actions={
					<>
						{isMobile && (
							<NagbarButton isMobile={isMobile} onClick={handleDismiss}>
								<Trans>Dismiss</Trans>
							</NagbarButton>
						)}
						<span className={styles.platformIcons}>
							<AppleLogoIcon weight="fill" className={styles.platformIcon} />
							<AndroidLogoIcon weight="fill" className={styles.platformIcon} />
							<WindowsLogoIcon weight="fill" className={styles.platformIcon} />
						</span>
						<NagbarButton isMobile={isMobile} onClick={handleDownload}>
							<Trans>Download</Trans>
						</NagbarButton>
					</>
				}
			/>
		</Nagbar>
	);
});
