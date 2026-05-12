/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import React from 'react';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {useMergeRefs} from '~/hooks/useMergeRefs';
import {elementSupportsRef} from '~/utils/react';

export type FocusRingWrapperProps<T extends HTMLElement> = {
	children: React.ReactElement;
	focusRingOffset?: number;
	focusRingEnabled?: boolean;
	focusRingWithin?: boolean;
	focusRingClassName?: string;
	focusClassName?: string;
	focusWithinClassName?: string;
} & React.HTMLAttributes<T>;

export const FocusRingWrapper = React.forwardRef<HTMLElement, FocusRingWrapperProps<HTMLElement>>(
	(
		{
			children,
			focusRingOffset = -2,
			focusRingEnabled = true,
			focusRingWithin = false,
			focusRingClassName,
			focusClassName,
			focusWithinClassName,
			className,
			...passThroughProps
		},
		forwardedRef,
	) => {
		type FocusRingWrapperChild = React.ReactElement<Record<string, unknown>> & {
			props: Record<string, unknown> & {ref?: React.Ref<HTMLElement> | null};
		};
		const child = React.Children.only(children) as FocusRingWrapperChild;
		const childProps = child.props as Record<string, unknown>;
		const supportsRef = elementSupportsRef(child);
		const childRef = supportsRef ? (childProps.ref as React.Ref<HTMLElement> | null) : null;
		const refs = supportsRef ? ([forwardedRef, childRef].filter(Boolean) as Array<React.Ref<HTMLElement>>) : [];
		const mergedRef = useMergeRefs(refs);
		const mergedProps: Record<string, unknown> = {...childProps};

		Object.entries(passThroughProps).forEach(([key, value]) => {
			if (key.startsWith('on') && typeof value === 'function' && typeof childProps[key] === 'function') {
				const childHandler = childProps[key];
				mergedProps[key] = (...args: Array<unknown>) => {
					(value as (...args: Array<unknown>) => void)(...args);
					(childHandler as (...args: Array<unknown>) => void)(...args);
				};
			} else if (key.startsWith('on') && typeof value === 'function') {
				mergedProps[key] = value;
			} else if (key === 'style') {
				mergedProps.style = {...((childProps.style as React.CSSProperties) ?? {}), ...(value as React.CSSProperties)};
			} else {
				mergedProps[key] = value;
			}
		});

		if (className) {
			mergedProps.className = clsx(childProps.className as string | undefined, className);
		}

		if (supportsRef && refs.length > 0) {
			mergedProps.ref = mergedRef;
		}

		return (
			<FocusRing
				offset={focusRingOffset}
				enabled={focusRingEnabled}
				within={focusRingWithin}
				ringClassName={focusRingClassName}
				focusClassName={focusClassName}
				focusWithinClassName={focusWithinClassName}
			>
				{React.cloneElement(child, mergedProps)}
			</FocusRing>
		);
	},
);

FocusRingWrapper.displayName = 'FocusRingWrapper';
