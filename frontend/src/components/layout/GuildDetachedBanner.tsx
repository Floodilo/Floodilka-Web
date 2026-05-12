/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useMemo} from 'react';
import {GuildFeatures} from '~/Constants';
import type {GuildRecord} from '~/records/GuildRecord';
import * as AvatarUtils from '~/utils/AvatarUtils';
import styles from './GuildDetachedBanner.module.css';

const MAX_VIEWPORT_HEIGHT_FRACTION = 0.3;
const DEFAULT_BANNER_HEIGHT = 240;

export function GuildDetachedBanner({guild}: {guild: GuildRecord}) {
	const aspectRatio = useMemo(
		() => (guild.bannerWidth && guild.bannerHeight ? guild.bannerWidth / guild.bannerHeight : undefined),
		[guild.bannerHeight, guild.bannerWidth],
	);
	const bannerAsset = AvatarUtils.getGuildBannerAsset({id: guild.id, banner: guild.banner});
	const isDetachedBanner = guild.features.has(GuildFeatures.DETACHED_BANNER);

	if (!bannerAsset || !isDetachedBanner) return null;

	const maxHeight = `${MAX_VIEWPORT_HEIGHT_FRACTION * 100}vh`;
	const bannerHeight = guild.bannerHeight ?? DEFAULT_BANNER_HEIGHT;

	return (
		<div
			className={styles.container}
			style={{maxHeight, ...(aspectRatio ? {aspectRatio: `${aspectRatio}`} : {height: bannerHeight})}}
		>
			{bannerAsset.videoUrl ? (
				<video
					className={styles.banner}
					src={bannerAsset.videoUrl}
					poster={bannerAsset.imageUrl}
					autoPlay
					loop
					muted
					playsInline
					aria-hidden="true"
				/>
			) : (
				<img src={bannerAsset.imageUrl} alt="" className={styles.banner} draggable={false} />
			)}
		</div>
	);
}
