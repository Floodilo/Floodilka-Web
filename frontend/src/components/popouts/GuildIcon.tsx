/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {useHover} from '~/hooks/useHover';
import * as AvatarUtils from '~/utils/AvatarUtils';
import {getInitialsLength} from '~/utils/GuildInitialsUtils';
import * as ImageCacheUtils from '~/utils/ImageCacheUtils';
import * as StringUtils from '~/utils/StringUtils';
import styles from './GuildIcon.module.css';

type GuildIconProps = {
	id: string;
	name: string;
	icon: string | null;
	className?: string;
	sizePx?: number;
	containerProps?: React.HTMLAttributes<HTMLElement> & {'data-jump-link-guild-icon'?: string};
};

type GuildIconStyleVars = React.CSSProperties & {
	'--guild-icon-size'?: string;
	'--guild-icon-image'?: string;
};

export const GuildIcon = observer(function GuildIcon({
	id,
	name,
	icon,
	className,
	sizePx,
	containerProps,
}: GuildIconProps) {
	const initials = React.useMemo(() => StringUtils.getInitialsFromName(name), [name]);
	const initialsLength = React.useMemo(() => getInitialsLength(initials), [initials]);
	const [hoverRef, isHovering] = useHover();

	const iconUrl = React.useMemo(() => (icon ? AvatarUtils.getGuildIconURL({id, icon}) : null), [id, icon]);
	const hoverIconUrl = React.useMemo(() => (icon ? AvatarUtils.getGuildIconURL({id, icon}, true) : null), [id, icon]);
	const hoverVideoUrl = React.useMemo(() => (icon ? AvatarUtils.getGuildIconVideoURL({id, icon}) : null), [id, icon]);

	const [isStaticLoaded, setIsStaticLoaded] = React.useState(() =>
		iconUrl ? ImageCacheUtils.hasImage(iconUrl) : false,
	);
	const [isAnimatedLoaded, setIsAnimatedLoaded] = React.useState(() =>
		hoverIconUrl ? ImageCacheUtils.hasImage(hoverIconUrl) : false,
	);
	const [shouldPlayAnimated, setShouldPlayAnimated] = React.useState(false);
	const [videoFailed, setVideoFailed] = React.useState(false);

	const useVideoOverlay = hoverVideoUrl !== null && !videoFailed;

	React.useEffect(() => {
		setIsStaticLoaded(iconUrl ? ImageCacheUtils.hasImage(iconUrl) : false);
		setIsAnimatedLoaded(hoverIconUrl ? ImageCacheUtils.hasImage(hoverIconUrl) : false);
		setShouldPlayAnimated(false);
		setVideoFailed(false);
	}, [iconUrl, hoverIconUrl, hoverVideoUrl]);

	React.useEffect(() => {
		if (!iconUrl || isStaticLoaded) return;

		let cancelled = false;
		ImageCacheUtils.loadImage(iconUrl, () => {
			if (!cancelled) setIsStaticLoaded(true);
		});
		return () => {
			cancelled = true;
		};
	}, [iconUrl, isStaticLoaded]);

	React.useEffect(() => {
		if (!isHovering || !hoverIconUrl || isAnimatedLoaded || useVideoOverlay) return;

		let cancelled = false;
		ImageCacheUtils.loadImage(hoverIconUrl, () => {
			if (!cancelled) setIsAnimatedLoaded(true);
		});
		return () => {
			cancelled = true;
		};
	}, [isHovering, hoverIconUrl, isAnimatedLoaded, useVideoOverlay]);

	React.useEffect(() => {
		setShouldPlayAnimated(Boolean(isHovering && (useVideoOverlay || isAnimatedLoaded)));
	}, [isHovering, isAnimatedLoaded, useVideoOverlay]);

	const activeUrl = shouldPlayAnimated && hoverIconUrl && !useVideoOverlay ? hoverIconUrl : iconUrl;

	const styleVars: GuildIconStyleVars = {};
	if (sizePx != null) {
		styleVars['--guild-icon-size'] = `${sizePx}px`;
	}
	if (isStaticLoaded && activeUrl) {
		styleVars['--guild-icon-image'] = `url(${activeUrl})`;
	}

	const showVideo = shouldPlayAnimated && useVideoOverlay && hoverVideoUrl !== null;

	return (
		<div
			ref={hoverRef}
			className={clsx(styles.container, className, !icon && styles.containerNoIcon)}
			{...containerProps}
			data-initials-length={initialsLength}
			style={styleVars}
		>
			{!icon && <span className={styles.initials}>{initials}</span>}
			{showVideo && (
				<video
					key={hoverVideoUrl}
					src={hoverVideoUrl}
					autoPlay
					loop
					muted
					playsInline
					onError={() => setVideoFailed(true)}
					className={styles.videoOverlay}
				/>
			)}
		</div>
	);
});
