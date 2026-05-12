/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Logger} from '~/lib/Logger';
import {syncVoiceStateToServer} from './VoiceChannelConnector';

export interface VoiceStateSyncPayload {
	guild_id: string | null;
	channel_id: string;
	connection_id: string;
	self_mute: boolean;
	self_deaf: boolean;
	self_video: boolean;
	self_stream: boolean;
	viewer_stream_key: string | null;
}

const logger = new Logger('VoiceStateSyncManager');

export class VoiceStateSyncManager {
	private pending: VoiceStateSyncPayload | null = null;
	private lastSent: VoiceStateSyncPayload | null = null;
	private inFlight: VoiceStateSyncPayload | null = null;
	private serverState: VoiceStateSyncPayload | null = null;
	private flushScheduled = false;

	reset(): void {
		this.pending = null;
		this.lastSent = null;
		this.inFlight = null;
		this.serverState = null;
		this.flushScheduled = false;
		logger.debug('[reset] Voice state sync cache cleared');
	}

	requestState(payload: VoiceStateSyncPayload): void {
		this.pending = payload;
		this.scheduleFlush();
	}

	confirmServerState(payload: VoiceStateSyncPayload | null): void {
		if (!payload) {
			this.serverState = null;
			return;
		}

		this.serverState = payload;
		if (this.inFlight && this.areEqual(this.inFlight, payload)) {
			this.inFlight = null;
			this.lastSent = payload;
		}

		if (this.pending && this.areEqual(this.pending, payload)) {
			this.pending = null;
		}

		this.scheduleFlush();
	}

	private scheduleFlush(): void {
		if (this.flushScheduled) return;
		this.flushScheduled = true;

		Promise.resolve().then(() => {
			this.flushScheduled = false;
			this.flush();
		});
	}

	private flush(): void {
		if (!this.pending) return;

		if (
			this.inFlight &&
			(this.inFlight.connection_id !== this.pending.connection_id ||
				this.inFlight.channel_id !== this.pending.channel_id ||
				this.inFlight.guild_id !== this.pending.guild_id)
		) {
			logger.debug('[flush] Dropping stale in-flight state after context change', {
				inFlight: this.inFlight,
				pending: this.pending,
			});
			this.inFlight = null;
		}

		if (this.inFlight) return;

		if (this.lastSent && this.areEqual(this.lastSent, this.pending)) {
			this.pending = null;
			return;
		}

		if (this.serverState && this.areEqual(this.serverState, this.pending)) {
			this.pending = null;
			this.lastSent = this.serverState;
			return;
		}

		logger.debug('[flush] Sending voice state update to server', this.pending);
		syncVoiceStateToServer(this.pending.guild_id, this.pending.channel_id, this.pending.connection_id, {
			self_mute: this.pending.self_mute,
			self_deaf: this.pending.self_deaf,
			self_video: this.pending.self_video,
			self_stream: this.pending.self_stream,
			viewer_stream_key: this.pending.viewer_stream_key,
		});

		this.lastSent = this.pending;
		this.inFlight = this.pending;
		this.pending = null;
	}

	private areEqual(a: VoiceStateSyncPayload, b: VoiceStateSyncPayload): boolean {
		return (
			a.guild_id === b.guild_id &&
			a.channel_id === b.channel_id &&
			a.connection_id === b.connection_id &&
			a.self_mute === b.self_mute &&
			a.self_deaf === b.self_deaf &&
			a.self_video === b.self_video &&
			a.self_stream === b.self_stream &&
			a.viewer_stream_key === b.viewer_stream_key
		);
	}
}
