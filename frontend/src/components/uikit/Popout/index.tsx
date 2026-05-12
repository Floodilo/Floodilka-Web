/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';

export const PopoutKeyContext = React.createContext<PopoutKey | null>(null);

export const usePopoutKeyContext = (): PopoutKey | null => {
	return React.useContext(PopoutKeyContext);
};

export type PopoutKey = string | number;

export type PopoutPosition =
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'top-start'
	| 'top-end'
	| 'bottom-start'
	| 'bottom-end'
	| 'left-start'
	| 'left-end'
	| 'right-start'
	| 'right-end';

export interface Popout {
	key: PopoutKey;
	dependsOn?: PopoutKey;
	position: PopoutPosition;
	target: HTMLElement;
	render: (props: {popoutKey: PopoutKey; onClose: () => void}) => React.ReactNode;
	zIndexBoost?: number;
	shouldAutoUpdate?: boolean;
	shouldReposition?: boolean;
	offsetMainAxis?: number;
	offsetCrossAxis?: number;
	animationType?: 'smooth' | 'none';
	containerClass?: string;
	onOpen?: () => void;
	onClose?: () => void;
	onCloseRequest?: (event?: Event) => boolean;
	returnFocusRef?: React.RefObject<HTMLElement | null> | React.RefObject<HTMLElement>;
	lastPosition?: {x: number; y: number};
	clickPos?: number;
	preventInvert?: boolean;
	disableBackdrop?: boolean;
	hoverMode?: boolean;
	onContentMouseEnter?: () => void;
	onContentMouseLeave?: () => void;
}
