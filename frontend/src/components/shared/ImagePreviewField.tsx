/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type React from 'react';
import styles from './ImagePreviewField.module.css';

export interface ImagePreviewFieldProps {
	imageUrl: string | null | undefined;
	videoUrl?: string | null;
	showPlaceholder: boolean;
	placeholderText: React.ReactNode;
	altText: string;
	aspectRatio?: string | number;
	className?: string;
	objectFit?: 'cover' | 'contain';
}

export const ImagePreviewField: React.FC<ImagePreviewFieldProps> = ({
	imageUrl,
	videoUrl,
	showPlaceholder,
	placeholderText,
	altText,
	aspectRatio,
	className,
	objectFit = 'cover',
}) => {
	const innerContainerStyle: React.CSSProperties = aspectRatio
		? {
				position: 'relative',
				width: '100%',
				paddingBottom: `${(1 / Number(aspectRatio)) * 100}%`,
			}
		: {};

	const imageContainerStyle: React.CSSProperties = aspectRatio
		? {
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
			}
		: {};

	const imageStyle: React.CSSProperties = {
		objectFit,
		width: '100%',
		height: '100%',
	};

	if (showPlaceholder || !imageUrl) {
		return (
			<div className={`${styles.placeholder} ${className ?? ''}`} style={aspectRatio ? innerContainerStyle : {}}>
				{aspectRatio ? (
					<div style={imageContainerStyle}>
						<span>{placeholderText}</span>
					</div>
				) : (
					<span>{placeholderText}</span>
				)}
			</div>
		);
	}

	const media = videoUrl ? (
		<video
			className={styles.image}
			style={imageStyle}
			src={videoUrl}
			poster={imageUrl}
			autoPlay
			loop
			muted
			playsInline
			aria-label={altText}
		/>
	) : (
		<img src={imageUrl} alt={altText} className={styles.image} style={imageStyle} />
	);

	return (
		<div className={`${styles.preview} ${className ?? ''}`} style={aspectRatio ? innerContainerStyle : {}}>
			{aspectRatio ? <div style={imageContainerStyle}>{media}</div> : media}
		</div>
	);
};
