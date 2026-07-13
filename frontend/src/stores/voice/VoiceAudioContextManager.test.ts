/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {VoiceAudioContextManager} from './VoiceAudioContextManager';

interface FakeCtx {
	state: 'suspended' | 'running' | 'closed';
	resume: ReturnType<typeof vi.fn>;
}

function installFakeAudioContext(
	opts: {constructible?: boolean; initialState?: FakeCtx['state']; withSetSinkId?: boolean} = {},
) {
	const constructible = opts.constructible ?? true;
	const created: Array<FakeCtx> = [];
	function FakeAudioContext(this: FakeCtx) {
		if (!constructible) throw new Error('cannot construct');
		this.state = opts.initialState ?? 'suspended';
		this.resume = vi.fn().mockImplementation(async () => {
			this.state = 'running';
		});
		created.push(this);
	}
	const Ctor = vi.fn(FakeAudioContext as unknown as () => FakeCtx);
	if (opts.withSetSinkId) {
		(Ctor as unknown as {prototype: Record<string, unknown>}).prototype.setSinkId = vi
			.fn()
			.mockResolvedValue(undefined);
	}
	Object.defineProperty(window, 'AudioContext', {value: Ctor, configurable: true, writable: true});
	return {Ctor, created};
}

function setElementSinkSupport(supported: boolean): () => void {
	const proto = HTMLMediaElement.prototype as unknown as Record<string, unknown>;
	const hadOwn = Object.hasOwn(proto, 'setSinkId');
	const original = hadOwn ? proto.setSinkId : undefined;
	if (supported) {
		proto.setSinkId = vi.fn().mockResolvedValue(undefined);
	} else {
		delete proto.setSinkId;
	}
	return () => {
		if (hadOwn) {
			proto.setSinkId = original;
		} else {
			delete proto.setSinkId;
		}
	};
}

function installFakeWebkitAudioContext() {
	function FakeWebkitAudioContext(this: FakeCtx) {
		this.state = 'running';
		this.resume = vi.fn().mockResolvedValue(undefined);
	}
	const Ctor = vi.fn(FakeWebkitAudioContext as unknown as () => FakeCtx);
	Object.defineProperty(window, 'webkitAudioContext', {value: Ctor, configurable: true, writable: true});
	return {Ctor};
}

function removeAudioContexts() {
	Object.defineProperty(window, 'AudioContext', {value: undefined, configurable: true, writable: true});
	Object.defineProperty(window, 'webkitAudioContext', {value: undefined, configurable: true, writable: true});
}

describe('VoiceAudioContextManager', () => {
	beforeEach(() => {
		removeAudioContexts();
	});

	afterEach(() => {
		removeAudioContexts();
		vi.restoreAllMocks();
	});

	it('returns null and reports unavailable when AudioContext is not supported', () => {
		const manager = new VoiceAudioContextManager();
		expect(manager.get()).toBeNull();
		expect(manager.isAvailable()).toBe(false);
	});

	it('creates the AudioContext lazily on first get()', () => {
		const {Ctor} = installFakeAudioContext();
		const manager = new VoiceAudioContextManager();
		expect(Ctor).not.toHaveBeenCalled();
		expect(manager.get()).not.toBeNull();
		expect(Ctor).toHaveBeenCalledTimes(1);
	});

	it('reuses the same AudioContext across multiple calls (singleton semantics)', () => {
		const {Ctor} = installFakeAudioContext();
		const manager = new VoiceAudioContextManager();
		const a = manager.get();
		const b = manager.get();
		const c = manager.get();
		expect(a).toBe(b);
		expect(b).toBe(c);
		expect(Ctor).toHaveBeenCalledTimes(1);
	});

	it('does not retry creation after a failure (prevents noisy loops)', () => {
		const {Ctor} = installFakeAudioContext({constructible: false});
		const manager = new VoiceAudioContextManager();
		expect(manager.get()).toBeNull();
		expect(manager.get()).toBeNull();
		expect(manager.get()).toBeNull();
		expect(Ctor).toHaveBeenCalledTimes(1);
		expect(manager.isAvailable()).toBe(false);
	});

	it('falls back to webkitAudioContext when AudioContext is missing (older Safari)', () => {
		const {Ctor} = installFakeWebkitAudioContext();
		const manager = new VoiceAudioContextManager();
		expect(manager.get()).not.toBeNull();
		expect(Ctor).toHaveBeenCalledTimes(1);
	});

	it('resumeIfNeeded resumes a suspended context', async () => {
		const {created} = installFakeAudioContext({initialState: 'suspended'});
		const manager = new VoiceAudioContextManager();
		manager.get();
		await manager.resumeIfNeeded();
		expect(created[0].resume).toHaveBeenCalledTimes(1);
		expect(created[0].state).toBe('running');
	});

	it('resumeIfNeeded is a no-op when context is already running', async () => {
		const {created} = installFakeAudioContext({initialState: 'running'});
		const manager = new VoiceAudioContextManager();
		manager.get();
		await manager.resumeIfNeeded();
		expect(created[0].resume).not.toHaveBeenCalled();
	});

	it('resumeIfNeeded is a no-op when context is closed', async () => {
		const {created} = installFakeAudioContext({initialState: 'closed'});
		const manager = new VoiceAudioContextManager();
		manager.get();
		await manager.resumeIfNeeded();
		expect(created[0].resume).not.toHaveBeenCalled();
	});

	it('resumeIfNeeded swallows rejection from resume (never crashes on autoplay blocks)', async () => {
		const {created} = installFakeAudioContext({initialState: 'suspended'});
		const manager = new VoiceAudioContextManager();
		manager.get();
		created[0].resume = vi.fn().mockRejectedValue(new Error('blocked by autoplay policy'));
		await expect(manager.resumeIfNeeded()).resolves.toBeUndefined();
	});

	it('resumeIfNeeded is a no-op when no context has ever been created', async () => {
		const manager = new VoiceAudioContextManager();
		await expect(manager.resumeIfNeeded()).resolves.toBeUndefined();
	});

	it('attaches gesture resume listeners on document after successful creation', () => {
		installFakeAudioContext();
		const addSpy = vi.spyOn(document, 'addEventListener');
		const manager = new VoiceAudioContextManager();
		manager.get();
		const attachedEvents = addSpy.mock.calls.map((call) => call[0]);
		expect(attachedEvents).toContain('pointerdown');
		expect(attachedEvents).toContain('keydown');
	});

	it('does not attach gesture listeners when AudioContext is unsupported', () => {
		const addSpy = vi.spyOn(document, 'addEventListener');
		const manager = new VoiceAudioContextManager();
		expect(manager.get()).toBeNull();
		const attachedEvents = addSpy.mock.calls.map((call) => call[0]);
		expect(attachedEvents).not.toContain('pointerdown');
		expect(attachedEvents).not.toContain('keydown');
	});

	describe('shouldUseForVoiceMix', () => {
		it('mixes through web audio when AudioContext supports setSinkId', () => {
			installFakeAudioContext({withSetSinkId: true});
			const restore = setElementSinkSupport(true);
			try {
				const manager = new VoiceAudioContextManager();
				expect(manager.shouldUseForVoiceMix()).toBe(true);
			} finally {
				restore();
			}
		});

		it('skips web audio mix when only media elements can switch sinks (Firefox)', () => {
			installFakeAudioContext();
			const restore = setElementSinkSupport(true);
			try {
				const manager = new VoiceAudioContextManager();
				expect(manager.shouldUseForVoiceMix()).toBe(false);
			} finally {
				restore();
			}
		});

		it('mixes through web audio when no sink selection exists at all (Safari)', () => {
			installFakeAudioContext();
			const restore = setElementSinkSupport(false);
			try {
				const manager = new VoiceAudioContextManager();
				expect(manager.shouldUseForVoiceMix()).toBe(true);
			} finally {
				restore();
			}
		});
	});

	describe('isUsedForVoiceMix', () => {
		it('is false when AudioContext is unsupported', () => {
			const restore = setElementSinkSupport(false);
			try {
				const manager = new VoiceAudioContextManager();
				expect(manager.isUsedForVoiceMix()).toBe(false);
			} finally {
				restore();
			}
		});

		it('is true when the context is creatable and eligible for mixing', () => {
			installFakeAudioContext({withSetSinkId: true});
			const restore = setElementSinkSupport(true);
			try {
				const manager = new VoiceAudioContextManager();
				expect(manager.isUsedForVoiceMix()).toBe(true);
			} finally {
				restore();
			}
		});

		it('is false when mixing would break element-based sink selection', () => {
			installFakeAudioContext();
			const restore = setElementSinkSupport(true);
			try {
				const manager = new VoiceAudioContextManager();
				expect(manager.isUsedForVoiceMix()).toBe(false);
			} finally {
				restore();
			}
		});
	});
});
