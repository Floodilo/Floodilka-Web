/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useCallback, useEffect, useRef, useState} from 'react';

export interface UseScrollSpyOptions {
	sectionIds: ReadonlyArray<string>;
	containerRef: React.RefObject<HTMLElement | null>;
	offset?: number;
}

export interface UseScrollSpyReturn {
	activeSectionId: string | null;
	scrollToSection: (sectionId: string) => void;
}

export function useScrollSpy({sectionIds, containerRef, offset = 68}: UseScrollSpyOptions): UseScrollSpyReturn {
	const [activeSectionId, setActiveSectionId] = useState<string | null>(sectionIds[0] ?? null);
	const rafIdRef = useRef<number | null>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container || sectionIds.length === 0) {
			setActiveSectionId(null);
			return;
		}

		const updateActive = () => {
			const containerRect = container.getBoundingClientRect();
			const scrollTop = container.scrollTop;
			const maxScrollTop = Math.max(0, container.scrollHeight - container.clientHeight);
			const isAtBottom = scrollTop >= maxScrollTop - 1;
			const target = scrollTop + offset + 1;
			let nextActive: string | null = null;

			for (const id of sectionIds) {
				const element = document.getElementById(id);
				if (!element) continue;

				const rect = element.getBoundingClientRect();
				const elementTop = rect.top - containerRect.top + scrollTop;

				if (elementTop <= target) {
					nextActive = id;
				} else if (nextActive) {
					break;
				}
			}

			if (!nextActive && sectionIds.length > 0) {
				nextActive = sectionIds[0];
			}

			if (isAtBottom && sectionIds.length > 0) {
				nextActive = sectionIds[sectionIds.length - 1];
			}

			if (nextActive) {
				setActiveSectionId((prev) => (prev === nextActive ? prev : nextActive));
			}
		};

		const scheduleUpdate = () => {
			if (rafIdRef.current != null) return;
			rafIdRef.current = window.requestAnimationFrame(() => {
				rafIdRef.current = null;
				updateActive();
			});
		};

		scheduleUpdate();
		container.addEventListener('scroll', scheduleUpdate, {passive: true});
		window.addEventListener('resize', scheduleUpdate);

		const resizeObserver = new ResizeObserver(() => scheduleUpdate());
		resizeObserver.observe(container);

		return () => {
			container.removeEventListener('scroll', scheduleUpdate);
			window.removeEventListener('resize', scheduleUpdate);
			resizeObserver.disconnect();
			if (rafIdRef.current != null) {
				cancelAnimationFrame(rafIdRef.current);
				rafIdRef.current = null;
			}
		};
	}, [sectionIds, containerRef, offset]);

	const scrollToSection = useCallback(
		(sectionId: string) => {
			const element = document.getElementById(sectionId);
			const container = containerRef.current;
			if (!element || !container) {
				return;
			}

			const containerRect = container.getBoundingClientRect();
			const elementRect = element.getBoundingClientRect();
			const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - offset;

			container.scrollTo({
				top: scrollTop,
				behavior: 'auto',
			});

			setActiveSectionId(sectionId);
		},
		[containerRef, offset],
	);

	return {activeSectionId, scrollToSection};
}
