/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import type {MentionSegment} from '~/utils/TextareaSegmentManager';
import {TextareaSegmentManager} from '~/utils/TextareaSegmentManager';

interface UseTextareaSegmentsReturn {
	segmentManagerRef: React.MutableRefObject<TextareaSegmentManager>;
	previousValueRef: React.MutableRefObject<string>;
	displayToActual: (displayText: string) => string;
	insertSegment: (
		currentText: string,
		insertPosition: number,
		displayText: string,
		actualText: string,
		type: MentionSegment['type'],
		id: string,
	) => {newText: string; newSegments: Array<MentionSegment>};
	handleTextChange: (newValue: string, oldValue: string) => void;
	clearSegments: () => void;
}

export function useTextareaSegments(): UseTextareaSegmentsReturn {
	const segmentManagerRef = React.useRef(new TextareaSegmentManager());
	const previousValueRef = React.useRef('');

	const displayToActual = React.useCallback((displayText: string): string => {
		return segmentManagerRef.current.displayToActual(displayText);
	}, []);

	const insertSegment = React.useCallback(
		(
			currentText: string,
			insertPosition: number,
			displayText: string,
			actualText: string,
			type: MentionSegment['type'],
			id: string,
		) => {
			return segmentManagerRef.current.insertSegment(currentText, insertPosition, displayText, actualText, type, id);
		},
		[],
	);

	const handleTextChange = React.useCallback((newValue: string, oldValue: string) => {
		const {changeStart, changeEnd, replacementLength} = TextareaSegmentManager.detectChange(oldValue, newValue);
		segmentManagerRef.current.updateSegmentsForTextChange(changeStart, changeEnd, replacementLength);
		previousValueRef.current = newValue;
	}, []);

	const clearSegments = React.useCallback(() => {
		segmentManagerRef.current.clear();
		previousValueRef.current = '';
	}, []);

	return {
		segmentManagerRef,
		previousValueRef,
		displayToActual,
		insertSegment,
		handleTextChange,
		clearSegments,
	};
}
