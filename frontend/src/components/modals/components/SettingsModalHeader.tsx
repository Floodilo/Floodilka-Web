/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {XIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import {AnimatePresence, motion} from 'framer-motion';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {NativeDragRegion} from '~/components/layout/NativeDragRegion';
import {Button} from '~/components/uikit/Button/Button';
import AccessibilityStore from '~/stores/AccessibilityStore';
import {settingsModalStyles} from '../shared/SettingsModalLayout';
import styles from './SettingsModalHeader.module.css';

interface SettingsModalHeaderProps {
	title: string;
	showUnsavedBanner: boolean;
	flashBanner: boolean;
	tabData: {
		onReset?: () => void;
		onSave?: () => void;
		isSubmitting?: boolean;
	};
	onClose: () => void;
}

export const SettingsModalHeader: React.FC<SettingsModalHeaderProps> = observer(
	({title, showUnsavedBanner, flashBanner, tabData, onClose}) => {
		const {t} = useLingui();
		const prefersReducedMotion = AccessibilityStore.useReducedMotion;

		return (
			<NativeDragRegion
				className={`${settingsModalStyles.desktopHeader} ${styles.headerTransition}`}
				style={{
					transitionDuration: prefersReducedMotion ? '0ms' : '200ms',
					backgroundColor:
						showUnsavedBanner && flashBanner
							? 'var(--status-danger)'
							: showUnsavedBanner
								? 'var(--background-primary)'
								: undefined,
				}}
			>
				<AnimatePresence mode="wait">
					{showUnsavedBanner ? (
						<motion.div
							key="banner"
							initial={prefersReducedMotion ? {opacity: 1} : {opacity: 0}}
							animate={{opacity: 1}}
							exit={prefersReducedMotion ? {opacity: 1} : {opacity: 0}}
							transition={prefersReducedMotion ? {duration: 0} : {duration: 0.25, ease: 'easeOut'}}
							className={styles.bannerContent}
						>
							<div className={styles.bannerTextContainer}>
								<div
									className={clsx(styles.bannerText, flashBanner ? styles.bannerTextFlash : styles.bannerTextNormal)}
								>
									<Trans>Careful! You have unsaved changes.</Trans>
								</div>
							</div>
							<div className={styles.bannerActions}>
								<Button variant="secondary" small={true} onClick={tabData.onReset}>
									<Trans>Reset</Trans>
								</Button>
								<Button small={true} onClick={tabData.onSave} submitting={tabData.isSubmitting}>
									<Trans>Save Changes</Trans>
								</Button>
							</div>
						</motion.div>
					) : (
						<motion.div
							key="title"
							initial={prefersReducedMotion ? {opacity: 1} : {opacity: 0}}
							animate={{opacity: 1}}
							exit={prefersReducedMotion ? {opacity: 1} : {opacity: 0}}
							transition={prefersReducedMotion ? {duration: 0} : {duration: 0.25, ease: 'easeOut'}}
							className={styles.titleContent}
						>
							<h1 className={styles.title}>{title}</h1>
							<button type="button" aria-label={t`Close`} onClick={onClose} className={settingsModalStyles.closeButton}>
								<XIcon weight="regular" className={styles.icon} />
							</button>
						</motion.div>
					)}
				</AnimatePresence>
			</NativeDragRegion>
		);
	},
);
