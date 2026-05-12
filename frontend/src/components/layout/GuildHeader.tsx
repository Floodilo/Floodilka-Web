/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {CaretDownIcon, DotsThreeIcon, SealCheckIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import {motion} from 'framer-motion';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ContextMenuActionCreators from '~/actions/ContextMenuActionCreators';
import {GuildFeatures} from '~/Constants';
import {GuildHeaderBottomSheet} from '~/components/bottomsheets/GuildHeaderBottomSheet';
import {GuildHeaderShell} from '~/components/layout/GuildHeaderShell';
import {NativeDragRegion} from '~/components/layout/NativeDragRegion';
import {GuildHeaderPopout} from '~/components/popouts/GuildHeaderPopout';
import {GuildContextMenu} from '~/components/uikit/ContextMenu/GuildContextMenu';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import type {GuildRecord} from '~/records/GuildRecord';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import PopoutStore from '~/stores/PopoutStore';
import * as AvatarUtils from '~/utils/AvatarUtils';
import styles from './GuildHeader.module.css';

const HEADER_MIN_HEIGHT = 56;
const DEFAULT_BANNER_ASPECT_RATIO = 16 / 9;
const MAX_VIEWPORT_HEIGHT_FRACTION = 0.3;

export const GuildHeader = observer(({guild}: {guild: GuildRecord}) => {
	const {t} = useLingui();
	const {popouts} = PopoutStore;
	const isOpen = 'guild-header' in popouts;
	const isMobile = MobileLayoutStore.isMobileLayout();

	const bannerAsset = AvatarUtils.getGuildBannerAsset({id: guild.id, banner: guild.banner});
	const bannerURL = bannerAsset?.imageUrl ?? null;
	const bannerVideoUrl = bannerAsset?.videoUrl ?? null;
	const isDetachedBanner = guild.features.has(GuildFeatures.DETACHED_BANNER);
	const showIntegratedBanner = Boolean(bannerURL && !isDetachedBanner);

	const headerContainerRef = React.useRef<HTMLDivElement | null>(null);

	const calculateBannerLayout = React.useCallback(() => {
		if (!showIntegratedBanner || !bannerURL) {
			return {height: HEADER_MIN_HEIGHT, centerCrop: false};
		}

		const width = headerContainerRef.current?.clientWidth ?? window.innerWidth;
		if (!width) return {height: HEADER_MIN_HEIGHT, centerCrop: false};

		const aspectRatio =
			guild.bannerWidth && guild.bannerHeight ? guild.bannerWidth / guild.bannerHeight : DEFAULT_BANNER_ASPECT_RATIO;

		const idealHeight = width / aspectRatio;
		const viewportCap = window.innerHeight * MAX_VIEWPORT_HEIGHT_FRACTION;
		const isCapped = idealHeight > viewportCap;

		return {
			height: Math.max(HEADER_MIN_HEIGHT, Math.min(idealHeight, viewportCap)),
			centerCrop: isMobile && isCapped,
		};
	}, [showIntegratedBanner, bannerURL, guild.bannerWidth, guild.bannerHeight, isMobile]);

	const [{height: bannerMaxHeight, centerCrop}, setBannerLayout] = React.useState(() => calculateBannerLayout());

	React.useLayoutEffect(() => {
		const updateLayout = () => setBannerLayout(calculateBannerLayout());
		updateLayout();
		window.addEventListener('resize', updateLayout);
		return () => window.removeEventListener('resize', updateLayout);
	}, [calculateBannerLayout]);

	const handleContextMenu = React.useCallback(
		(event: React.MouseEvent) => {
			ContextMenuActionCreators.openFromEvent(event, ({onClose}) => (
				<GuildContextMenu guild={guild} onClose={onClose} />
			));
		},
		[guild],
	);

	const headerButtonRef = React.useRef<HTMLDivElement | null>(null);

	return (
		<div className={styles.headerWrapper}>
			<NativeDragRegion
				as={motion.div}
				ref={headerContainerRef}
				className={clsx(
					styles.headerContainer,
					!showIntegratedBanner && styles.headerContainerNoBanner,
					!showIntegratedBanner && isOpen && styles.headerContainerActive,
				)}
				style={{height: showIntegratedBanner ? bannerMaxHeight : HEADER_MIN_HEIGHT}}
			>
				{showIntegratedBanner && (
					<>
						{bannerVideoUrl ? (
							<video
								className={clsx(styles.bannerVideo, centerCrop && styles.bannerVideoCentered)}
								src={bannerVideoUrl}
								poster={bannerURL ?? undefined}
								autoPlay
								loop
								muted
								playsInline
								aria-hidden="true"
							/>
						) : (
							<div
								className={clsx(styles.bannerBackground, centerCrop && styles.bannerBackgroundCentered)}
								style={{backgroundImage: `url(${bannerURL})`}}
							/>
						)}
						<div className={styles.bannerGradient} />
					</>
				)}

				<GuildHeaderShell
					popoutId="guild-header"
					renderPopout={() => <GuildHeaderPopout guild={guild} />}
					renderBottomSheet={({isOpen, onClose}) => (
						<GuildHeaderBottomSheet isOpen={isOpen} onClose={onClose} guild={guild} />
					)}
					onContextMenu={handleContextMenu}
					className={styles.headerContent}
					triggerRef={headerButtonRef}
				>
					{(isOpen) => (
						<>
							{guild.features.has(GuildFeatures.VERIFIED) && (
								<Tooltip text={t`Verified Community`} position="bottom">
									<SealCheckIcon
										className={showIntegratedBanner ? styles.verifiedIconWithBanner : styles.verifiedIconDefault}
									/>
								</Tooltip>
							)}
							<span className={showIntegratedBanner ? styles.guildNameWithBanner : styles.guildNameDefault}>
								{guild.name}
							</span>
							{isMobile ? (
								<DotsThreeIcon
									weight="bold"
									className={showIntegratedBanner ? styles.dotsIconWithBanner : styles.dotsIconDefault}
								/>
							) : (
								<CaretDownIcon
									weight="bold"
									className={clsx(
										showIntegratedBanner ? styles.caretIconWithBanner : styles.caretIconDefault,
										isOpen && styles.caretIconOpen,
									)}
								/>
							)}
						</>
					)}
				</GuildHeaderShell>
			</NativeDragRegion>
		</div>
	);
});
