/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useCallback, useRef, useState} from 'react';

export interface UseControlsVisibilityOptions {
	autohideDelay?: number;
	disabled?: boolean;
	isPlaying?: boolean;
	isInteracting?: boolean;
}

export interface UseControlsVisibilityReturn {
	controlsVisible: boolean;
	showControls: () => void;
	hideControls: () => void;
	containerProps: {
		onMouseMove: () => void;
		onMouseEnter: () => void;
		onMouseLeave: () => void;
		onTouchStart: () => void;
	};
}

export function useControlsVisibility(options: UseControlsVisibilityOptions = {}): UseControlsVisibilityReturn {
	const {disabled = false, isPlaying = false, isInteracting = false} = options;

	const [controlsVisible, setControlsVisible] = useState(true);
	const isHoveredRef = useRef(false);

	const shouldShowControls = disabled || !isPlaying || isHoveredRef.current || isInteracting;

	const showControls = useCallback(() => {
		setControlsVisible(true);
	}, []);

	const hideControls = useCallback(() => {
		setControlsVisible(false);
	}, []);

	const handleMouseMove = useCallback(() => {
		if (!controlsVisible) {
			setControlsVisible(true);
		}
	}, [controlsVisible]);

	const handleMouseEnter = useCallback(() => {
		isHoveredRef.current = true;
		setControlsVisible(true);
	}, []);

	const handleMouseLeave = useCallback(() => {
		isHoveredRef.current = false;
		if (isPlaying && !isInteracting) {
			setControlsVisible(false);
		}
	}, [isPlaying, isInteracting]);

	const handleTouchStart = useCallback(() => {
		if (isPlaying && !isInteracting) {
			setControlsVisible((prev) => !prev);
		} else {
			setControlsVisible(true);
		}
	}, [isPlaying, isInteracting]);

	const finalVisible = shouldShowControls || controlsVisible;

	return {
		controlsVisible: finalVisible,
		showControls,
		hideControls,
		containerProps: {
			onMouseMove: handleMouseMove,
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave,
			onTouchStart: handleTouchStart,
		},
	};
}
