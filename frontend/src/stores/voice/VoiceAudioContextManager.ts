/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Logger} from '~/lib/Logger';

const logger = new Logger('VoiceAudioContextManager');

type AudioContextCtor = typeof AudioContext;

type AudioContextOptionsWithSinkId = AudioContextOptions & {sinkId?: string};

type AudioContextWithSinkId = AudioContext & {
	setSinkId?: (sinkId: string | {type: 'none'}) => Promise<void>;
};

function resolveAudioContextCtor(): AudioContextCtor | null {
	if (typeof window === 'undefined') return null;
	const w = window as typeof window & {webkitAudioContext?: AudioContextCtor};
	return w.AudioContext ?? w.webkitAudioContext ?? null;
}

function contextSupportsSinkSelection(): boolean {
	const Ctor = resolveAudioContextCtor();
	return !!Ctor?.prototype && 'setSinkId' in Ctor.prototype;
}

function elementSupportsSinkSelection(): boolean {
	return typeof HTMLMediaElement !== 'undefined' && 'setSinkId' in HTMLMediaElement.prototype;
}

export class VoiceAudioContextManager {
	private ctx: AudioContext | null = null;
	private creationAttempted = false;
	private gestureListenerAttached = false;
	private desiredSinkId = 'default';

	get(): AudioContext | null {
		if (this.ctx) return this.ctx;
		if (this.creationAttempted) return null;
		this.creationAttempted = true;

		const Ctor = resolveAudioContextCtor();
		if (!Ctor) {
			logger.warn('AudioContext not supported — volume boost disabled');
			return null;
		}

		const wantsExplicitSink = this.desiredSinkId !== 'default';
		const options: AudioContextOptionsWithSinkId = {latencyHint: 'interactive'};
		if (wantsExplicitSink) {
			options.sinkId = this.desiredSinkId;
		}

		try {
			this.ctx = new Ctor(options);
		} catch (error) {
			if (wantsExplicitSink) {
				logger.warn('Failed to create AudioContext with requested sink, retrying with default', {
					error,
					sinkId: this.desiredSinkId,
				});
				try {
					this.ctx = new Ctor({latencyHint: 'interactive'});
				} catch (retryError) {
					logger.warn('Failed to create AudioContext — volume boost disabled', {error: retryError});
					return null;
				}
				void this.applySinkId(this.desiredSinkId);
			} else {
				logger.warn('Failed to create AudioContext — volume boost disabled', {error});
				return null;
			}
		}
		this.attachGestureResumeListener();
		return this.ctx;
	}

	setSinkId(deviceId: string | null | undefined): void {
		const normalized = deviceId && deviceId.length > 0 ? deviceId : 'default';
		if (this.desiredSinkId === normalized) return;
		this.desiredSinkId = normalized;
		if (this.ctx) {
			void this.applySinkId(normalized);
		}
	}

	private async applySinkId(deviceId: string): Promise<void> {
		const ctx = this.ctx as AudioContextWithSinkId | null;
		if (!ctx || typeof ctx.setSinkId !== 'function') return;
		const sinkId = deviceId === 'default' ? '' : deviceId;
		try {
			await ctx.setSinkId(sinkId);
		} catch (error) {
			logger.warn('Failed to apply audio output sink', {deviceId, error});
		}
	}

	isAvailable(): boolean {
		return this.get() !== null;
	}

	/**
	 * Whether voice audio should be mixed through this AudioContext
	 * (LiveKit `webAudioMix`). When the browser cannot steer an
	 * AudioContext's output device (no AudioContext.setSinkId, e.g. Firefox)
	 * but can steer <audio> elements, mixing would permanently pin voice to
	 * the default output — prefer element playback there so output device
	 * selection keeps working.
	 */
	shouldUseForVoiceMix(): boolean {
		return contextSupportsSinkSelection() || !elementSupportsSinkSelection();
	}

	/** True when in-call audio actually flows through this context. */
	isUsedForVoiceMix(): boolean {
		return this.shouldUseForVoiceMix() && this.isAvailable();
	}

	async resumeIfNeeded(): Promise<void> {
		const ctx = this.ctx;
		if (!ctx) return;
		if (ctx.state === 'running' || ctx.state === 'closed') return;
		try {
			await ctx.resume();
		} catch (error) {
			logger.debug('AudioContext resume deferred until user gesture', {error});
		}
	}

	private attachGestureResumeListener(): void {
		if (this.gestureListenerAttached) return;
		if (typeof document === 'undefined') return;
		this.gestureListenerAttached = true;
		const handler = (): void => {
			void this.resumeIfNeeded();
		};
		document.addEventListener('pointerdown', handler, {capture: true, passive: true});
		document.addEventListener('keydown', handler, {capture: true, passive: true});
	}
}

export default new VoiceAudioContextManager();
