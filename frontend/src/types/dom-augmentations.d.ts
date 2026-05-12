/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

interface HighlightRegistry {
	clear(): void;
	delete(name: string): boolean;
	entries(): IterableIterator<[string, Highlight]>;
	get(name: string): Highlight | undefined;
	has(name: string): boolean;
	keys(): IterableIterator<string>;
	set(name: string, highlight: Highlight): HighlightRegistry;
	values(): IterableIterator<Highlight>;
	[Symbol.iterator](): IterableIterator<[string, Highlight]>;
}

interface RTCStatsReport {
	entries(): IterableIterator<[string, RTCStats]>;
	get(key: string): RTCStats | undefined;
	has(key: string): boolean;
	keys(): IterableIterator<string>;
	values(): IterableIterator<RTCStats>;
	[Symbol.iterator](): IterableIterator<[string, RTCStats]>;
}
