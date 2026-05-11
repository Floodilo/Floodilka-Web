/*
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 *
 * This file is part of Floodilka, a fork of Fluxer
 * (https://github.com/fluxerapp/fluxer).
 * Modified by Floodilka Contributors starting March 2026.
 *
 * Floodilka is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Floodilka is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Floodilka. If not, see <https://www.gnu.org/licenses/>.
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
