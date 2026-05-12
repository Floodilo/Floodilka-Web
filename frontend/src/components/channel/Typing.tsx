/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type {CSSProperties} from 'react';
import styles from '~/styles/Typing.module.css';

interface TypingProps {
	className?: string;
	size?: number;
	style?: CSSProperties;
	color?: string;
}

export const Typing = observer(
	({className, size = 40, style, color = 'var(--typing-indicator-color, var(--text-chat))'}: TypingProps) => {
		const {t} = useLingui();
		const scale = size / 40;
		const x = 3.75 * scale;
		const y = 7.5 * scale;
		const width = 17.5 * scale;
		const height = 5 * scale;
		const viewBoxWidth = 20;
		const viewBoxHeight = 5;
		const mergedStyle = {...(style || {}), color};

		return (
			<svg
				x={x}
				y={y}
				width={width}
				height={height}
				viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
				className={className}
				style={mergedStyle}
				role="img"
				aria-label={t`Typing indicator`}
			>
				<circle cx="2.5" cy="2.5" r="2.5" className={styles.dot} fill={color} />
				<circle cx="8.75" cy="2.5" r="2.5" className={styles.dot} fill={color} />
				<circle cx={15} cy="2.5" r="2.5" className={styles.dot} fill={color} />
			</svg>
		);
	},
);
