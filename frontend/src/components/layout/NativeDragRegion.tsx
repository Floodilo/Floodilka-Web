/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import type {MotionStyle} from 'framer-motion';
import React from 'react';
import styles from './NativeDragRegion.module.css';

type ElementType = React.ElementType;

type NativeDragRegionProps = Omit<React.HTMLAttributes<HTMLElement>, 'style'> & {
	as?: ElementType;
	disabled?: boolean;
	style?: React.CSSProperties | MotionStyle;
};

export const NativeDragRegion = React.forwardRef<HTMLElement, NativeDragRegionProps>(
	function NativeDragRegionInner(props, ref) {
		const {as, disabled = false, className, ...rest} = props;
		const Component = (as ?? 'div') as ElementType;

		return (
			<Component
				ref={ref as React.Ref<HTMLElement>}
				className={clsx(className, !disabled && styles.nativeDragRegion)}
				{...rest}
			/>
		);
	},
);

NativeDragRegion.displayName = 'NativeDragRegion';
