/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {TrashIcon} from '@phosphor-icons/react';
import {AnimatePresence, motion} from 'framer-motion';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {ChannelTypes} from '~/Constants';
import {ChannelDeleteModal} from '~/components/modals/ChannelDeleteModal';
import {Scroller} from '~/components/uikit/Scroller';
import type {ChannelRecord} from '~/records/ChannelRecord';
import type {MobileNavigationState} from '../hooks/useMobileNavigation';
import {MobileHeader, MobileSettingsDangerItem, MobileSettingsList} from '../shared/MobileSettingsComponents';
import styles from '../UserSettingsModal.module.css';
import type {ChannelSettingsTab, ChannelSettingsTabType} from '../utils/channelSettingsConstants';

interface MobileChannelSettingsViewProps {
	channel: ChannelRecord;
	groupedSettingsTabs: Record<string, Array<ChannelSettingsTab>>;
	currentTab?: ChannelSettingsTab;
	mobileNav: MobileNavigationState<ChannelSettingsTabType>;
	onBack: () => void;
	onTabSelect: (tabType: string, title: string) => void;
}

const contentFadeVariants = {
	enter: {
		opacity: 0,
	},
	center: {
		opacity: 1,
	},
	exit: {
		opacity: 0,
	},
};

const headerFadeVariants = {
	enter: {
		opacity: 0,
	},
	center: {
		opacity: 1,
	},
	exit: {
		opacity: 0,
	},
};

export const MobileChannelSettingsView: React.FC<MobileChannelSettingsViewProps> = observer(
	({channel, groupedSettingsTabs, currentTab, mobileNav, onBack, onTabSelect}) => {
		const {t} = useLingui();

		const handleDeleteChannel = React.useCallback(() => {
			ModalActionCreators.push(modal(() => <ChannelDeleteModal channelId={channel.id} />));
		}, [channel.id]);

		const isCategory = channel.type === ChannelTypes.GUILD_CATEGORY;

		const showMobileList = mobileNav.isRootView;
		const showMobileContent = !mobileNav.isRootView;

		const dangerAction = (
			<MobileSettingsDangerItem
				icon={TrashIcon}
				label={isCategory ? t`Delete Category` : t`Delete Channel`}
				onClick={handleDeleteChannel}
			/>
		);

		return (
			<div className={styles.mobileWrapper}>
				<div className={styles.mobileHeaderContainer}>
					<AnimatePresence mode="wait" custom={mobileNav.direction}>
						{showMobileList && (
							<motion.div
								key="mobile-list-header"
								variants={headerFadeVariants}
								initial="center"
								animate="center"
								exit="exit"
								transition={{
									duration: 0.08,
									ease: 'easeInOut',
								}}
								className={styles.mobileHeaderContent}
							>
								<MobileHeader title={channel.name || ''} onBack={onBack} />
							</motion.div>
						)}

						{showMobileContent && currentTab && (
							<motion.div
								key={`mobile-content-header-${mobileNav.currentView?.tab}`}
								variants={headerFadeVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									duration: 0.08,
									ease: 'easeInOut',
								}}
								className={styles.mobileHeaderContent}
							>
								<MobileHeader title={mobileNav.currentView?.title || currentTab.label} onBack={onBack} />
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<div className={styles.mobileContentContainer}>
					<AnimatePresence mode="wait" custom={mobileNav.direction}>
						{showMobileList && (
							<motion.div
								key="mobile-list-content"
								custom={mobileNav.direction}
								variants={contentFadeVariants}
								initial="center"
								animate="center"
								exit="exit"
								transition={{
									duration: 0.15,
									ease: 'easeInOut',
								}}
								className={styles.mobileContentPane}
								style={{willChange: 'transform'}}
							>
								<MobileSettingsList
									groupedTabs={groupedSettingsTabs}
									onTabSelect={onTabSelect}
									hiddenCategories={['channel_settings']}
									dangerContent={dangerAction}
								/>
							</motion.div>
						)}

						{showMobileContent && currentTab && (
							<motion.div
								key={`mobile-content-${mobileNav.currentView?.tab}`}
								custom={mobileNav.direction}
								variants={contentFadeVariants}
								initial="enter"
								animate="center"
								exit="exit"
								transition={{
									duration: 0.15,
									ease: 'easeInOut',
								}}
								className={styles.mobileContentPane}
								style={{willChange: 'transform'}}
							>
								<Scroller className={styles.mobileContentScroller} key="mobile-channel-settings-content-scroller">
									<div className={styles.mobileContentInner}>
										<currentTab.component channelId={channel.id} />
									</div>
								</Scroller>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		);
	},
);
