/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {clsx} from 'clsx';
import {useEffect, useMemo, useState} from 'react';
import styles from './SignalStrengthIcon.module.css';

interface Props {
	latency: number | null;
	className?: string;
	thresholds?: [number, number, number];
	size?: number;
	strokeWidth?: number;
}

const ARC_COUNT = 4;
const LOADING_STEP_MS = 280;

function useInterval(enabled: boolean, callback: () => void, delayMs: number) {
	useEffect(() => {
		if (!enabled) return;
		const id = window.setInterval(callback, delayMs);
		return () => window.clearInterval(id);
	}, [enabled, callback, delayMs]);
}

interface LatencyLoadingState {
	kind: 'loading';
}

interface LatencyValueState {
	kind: 'value';
	filledCount: number;
	colorClass: string;
}

type LatencyState = LatencyLoadingState | LatencyValueState;

function getLatencyState(latency: number | null, thresholds: [number, number, number]): LatencyState {
	if (latency === null) return {kind: 'loading'};

	const [good, ok, meh] = thresholds;

	switch (true) {
		case latency < good:
			return {kind: 'value', filledCount: 4, colorClass: styles.green};
		case latency < ok:
			return {kind: 'value', filledCount: 3, colorClass: styles.yellow};
		case latency < meh:
			return {kind: 'value', filledCount: 2, colorClass: styles.orange};
		default:
			return {kind: 'value', filledCount: 1, colorClass: styles.red};
	}
}

export function SignalStrengthIcon({
	latency,
	className,
	thresholds = [50, 100, 150],
	size = 16,
	strokeWidth = 2,
}: Props) {
	const {t} = useLingui();
	const [loadingIndex, setLoadingIndex] = useState(0);

	useInterval(
		latency === null,
		() => {
			const total = ARC_COUNT + 1;
			setLoadingIndex((prev) => (prev + 1) % total);
		},
		LOADING_STEP_MS,
	);

	const state = useMemo(() => getLatencyState(latency, thresholds), [latency, thresholds]);

	const geom = useMemo(() => {
		const viewSize = size;
		const ox = strokeWidth / 2;
		const oy = viewSize - strokeWidth / 2;
		const maxR = viewSize - strokeWidth;
		const step = maxR / ARC_COUNT;
		const dotR = Math.max(1.5, strokeWidth - 0.5);

		const arcs = Array.from({length: ARC_COUNT}, (_, i) => {
			const r = step * (i + 1);
			const sx = ox;
			const sy = oy - r;
			const ex = ox + r;
			const ey = oy;
			const d = `M ${sx} ${sy} A ${r} ${r} 0 0 1 ${ex} ${ey}`;
			return {r, d, arcIndex: i + 1};
		});

		return {viewSize, ox, oy, dotR, arcs};
	}, [size, strokeWidth]);

	const ariaLabel = latency === null ? t`Signal strength loading` : t`Latency ${latency} milliseconds`;

	const dotClass = useMemo(() => {
		if (state.kind === 'loading') {
			return clsx(loadingIndex === 0 ? styles.tertiary : styles.tertiaryMuted);
		}
		return state.colorClass;
	}, [state, loadingIndex]);

	return (
		<svg
			width={geom.viewSize}
			height={geom.viewSize}
			viewBox={`0 0 ${geom.viewSize} ${geom.viewSize}`}
			className={clsx(styles.svg, className)}
			role="img"
			aria-label={ariaLabel}
		>
			<circle cx={geom.ox} cy={geom.oy} r={geom.dotR} className={dotClass} fill="currentColor" />

			{geom.arcs.map(({d, arcIndex}, i) => {
				const isActiveLoading = state.kind === 'loading' && loadingIndex === arcIndex;

				const isFilled = state.kind === 'value' ? i < state.filledCount : false;

				const arcClass =
					state.kind === 'loading'
						? clsx(isActiveLoading ? styles.tertiary : styles.tertiaryMuted)
						: clsx(isFilled ? state.colorClass : styles.tertiaryMuted);

				return (
					<path
						key={arcIndex}
						d={d}
						fill="none"
						stroke="currentColor"
						strokeWidth={strokeWidth}
						className={arcClass}
						strokeLinecap="round"
					/>
				);
			})}
		</svg>
	);
}
