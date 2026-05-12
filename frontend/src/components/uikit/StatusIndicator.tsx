/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {memo} from 'react';
import {StatusTypes} from '~/Constants';

interface StatusIndicatorProps {
	status: string;
	size?: number;
	className?: string;
	appearance?: 'default' | 'monochrome';
	monochromeColor?: string;
}

const normalizeStatus = (status: string) => (status === StatusTypes.INVISIBLE ? StatusTypes.OFFLINE : status);

export const StatusIndicator = memo(
	({status, size = 12, className, appearance = 'default', monochromeColor}: StatusIndicatorProps) => {
		const normalizedStatus = normalizeStatus(status);
		const maskId = `svg-mask-status-${normalizedStatus}`;
		const fill =
			appearance === 'monochrome' ? (monochromeColor ?? 'currentColor') : `var(--status-${normalizedStatus})`;

		return (
			<svg
				className={className}
				width={size}
				height={size}
				viewBox="0 0 1 1"
				preserveAspectRatio="none"
				style={{display: 'block'}}
				aria-hidden={false}
				aria-label={`status-${normalizedStatus}`}
				role="img"
			>
				<rect x={0} y={0} width={1} height={1} fill={fill} mask={`url(#${maskId})`} />
			</svg>
		);
	},
);

interface RenderStatusIconOptions {
	appearance?: 'default' | 'monochrome';
	monochromeColor?: string;
}

export const renderStatusIconContent = (status: string, size: number, options: RenderStatusIconOptions = {}) => {
	const {appearance = 'default', monochromeColor} = options;
	const normalizedStatus = normalizeStatus(status);
	const maskId = `svg-mask-status-${normalizedStatus}`;
	const fill = appearance === 'monochrome' ? (monochromeColor ?? 'currentColor') : `var(--status-${normalizedStatus})`;

	return (
		// biome-ignore lint/a11y/noSvgWithoutTitle: decorative SVG, aria-hidden
		<svg width={size} height={size} viewBox="0 0 1 1" preserveAspectRatio="none" style={{display: 'block'}} aria-hidden>
			<rect x={0} y={0} width={1} height={1} fill={fill} mask={`url(#${maskId})`} />
		</svg>
	);
};
