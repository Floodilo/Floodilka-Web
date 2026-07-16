/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Room, RoomOptions} from 'livekit-client';
import {Room as LiveKitRoom, RoomEvent} from 'livekit-client';
import {makeAutoObservable, runInAction} from 'mobx';
import type {Subscription} from 'rxjs';
import {timer} from 'rxjs';
import {Logger} from '~/lib/Logger';
import VoiceSettingsStore from '~/stores/VoiceSettingsStore';
import VoiceAudioContextManager from './VoiceAudioContextManager';
import {VoiceConnectionThrottle} from './VoiceConnectionThrottle';
import {VoiceReconnectManager} from './VoiceReconnectManager';

const logger = new Logger('VoiceConnectionManager');

const VOICE_SERVER_TIMEOUT_MS = 5000;

export interface VoiceServerUpdateData {
	token: string;
	endpoint: string;
	connection_id: string;
	guild_id?: string;
	channel_id?: string;
}

export interface VoiceConnectionState {
	room: Room | null;
	guildId: string | null;
	channelId: string | null;
	connecting: boolean;
	connected: boolean;
	reconnecting: boolean;
	voiceServerEndpoint: string | null;
	connectionId: string | null;
}

const initialConnectionState: VoiceConnectionState = {
	room: null,
	guildId: null,
	channelId: null,
	connecting: false,
	connected: false,
	reconnecting: false,
	voiceServerEndpoint: null,
	connectionId: null,
};

class VoiceConnectionManager {
	connectionState: VoiceConnectionState = initialConnectionState;
	private throttle = new VoiceConnectionThrottle();
	private reconnect = new VoiceReconnectManager();
	private voiceServerTimeoutSub: Subscription | null = null;
	private isLocalDisconnecting = false;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	get room(): Room | null {
		return this.connectionState.room;
	}

	get guildId(): string | null {
		return this.connectionState.guildId;
	}

	get channelId(): string | null {
		return this.connectionState.channelId;
	}

	get connected(): boolean {
		return this.connectionState.connected;
	}

	get connecting(): boolean {
		return this.connectionState.connecting;
	}

	get reconnecting(): boolean {
		return this.connectionState.reconnecting;
	}

	get connectionId(): string | null {
		return this.connectionState.connectionId;
	}

	get voiceServerEndpoint(): string | null {
		return this.connectionState.voiceServerEndpoint;
	}

	get shouldAutoReconnect(): boolean {
		return this.reconnect.shouldAutoReconnect;
	}

	get reconnectAttempts(): number {
		return this.reconnect.reconnectAttempts;
	}

	get disconnecting(): boolean {
		return this.isLocalDisconnecting;
	}

	get lastConnectedChannel(): {guildId: string; channelId: string} | null {
		return this.reconnect.lastConnectedChannel;
	}

	startConnection(guildId: string | null, channelId: string): void {
		this.throttle.incrementAttemptId();

		runInAction(() => {
			this.connectionState = {
				...this.connectionState,
				channelId,
				guildId,
				connecting: true,
				connected: false,
				reconnecting: false,
				connectionId: this.connectionState.connectionId,
			};
		});

		this.throttle.setInFlightConnect(true);
		this.scheduleVoiceServerTimeout(guildId, channelId);
		this.reconnect.setLastConnectedChannel(guildId, channelId);

		logger.info('Connection started', {guildId, channelId});
	}

	handleVoiceServerUpdate(
		raw: VoiceServerUpdateData,
		onRoomCreated: (room: Room, attemptId: number, guildId: string | null, channelId: string) => void,
		onConnectionFailed?: () => void,
	): void {
		const guildId = raw.guild_id ?? null;
		const rawChannelId = raw.channel_id ?? null;
		const endpoint = raw.endpoint ?? null;
		const token = raw.token ?? null;
		const connectionId = raw.connection_id ?? null;

		const {guildId: expectedGuildId, channelId: stateChannelId, room: existingRoom} = this.connectionState;
		const channelId = rawChannelId ?? stateChannelId;
		const attemptId = this.throttle.connectAttemptId;
		const stateReset = expectedGuildId === null && stateChannelId === null;

		logger.debug('handleVoiceServerUpdate called', {
			incomingGuildId: guildId,
			expectedGuildId,
			channelId,
			rawChannelId,
			stateChannelId,
			endpoint,
			hasToken: !!token,
			connectionId,
			attemptId,
			stateReset,
		});

		if (channelId == null) {
			logger.warn('Ignoring VOICE_SERVER_UPDATE: no channel_id in payload or state', {
				rawChannelId,
				stateChannelId,
			});
			return;
		}

		if (!stateReset && expectedGuildId !== guildId) {
			logger.warn('Ignoring VOICE_SERVER_UPDATE: guild mismatch', {
				expectedGuildId,
				incomingGuildId: guildId,
			});
			return;
		}

		if (!this.throttle.isLatestAttempt(attemptId)) {
			logger.warn('Ignoring VOICE_SERVER_UPDATE: not latest attempt', {attemptId});
			return;
		}

		this.clearVoiceServerTimeout();

		// Tear down any previous room even if it is still connecting, and invalidate its
		// guarded handlers by bumping the attempt id. Otherwise a duplicate
		// VOICE_SERVER_UPDATE leaves two rooms sharing one attempt id, and when LiveKit
		// kicks the older one its Disconnected handler tears down the live connection.
		if (existingRoom) {
			existingRoom.removeAllListeners();
			existingRoom.disconnect();
		}
		this.throttle.incrementAttemptId();
		const roomAttemptId = this.throttle.connectAttemptId;

		runInAction(() => {
			this.connectionState = {
				...this.connectionState,
				connecting: true,
				connected: false,
				reconnecting: false,
				guildId,
				channelId,
				voiceServerEndpoint: endpoint,
				connectionId: connectionId ?? this.connectionState.connectionId,
			};
		});

		this.reconnect.setLastConnectedChannel(guildId, channelId);
		this.throttle.setInFlightConnect(true);

		const roomOptions: RoomOptions = {adaptiveStream: true, dynacast: true};
		const outputDeviceId = VoiceSettingsStore.getOutputDeviceId();
		VoiceAudioContextManager.setSinkId(outputDeviceId);
		if (VoiceAudioContextManager.shouldUseForVoiceMix()) {
			const audioContext = VoiceAudioContextManager.get();
			if (audioContext) {
				roomOptions.webAudioMix = {audioContext};
				void VoiceAudioContextManager.resumeIfNeeded();
			}
		}
		if (outputDeviceId !== 'default') {
			// Applied by LiveKit to every attached <audio> element: the only audio
			// path when webAudioMix is off, and a Chrome echo-cancellation
			// workaround when it's on (crbug 40252911).
			roomOptions.audioOutput = {deviceId: outputDeviceId};
		}
		const room = new LiveKitRoom(roomOptions);

		onRoomCreated(room, roomAttemptId, guildId, channelId);

		if (!endpoint || !token) {
			logger.error('Missing endpoint or token', {endpoint, hasToken: !!token});
			runInAction(() => {
				this.connectionState = {
					...this.connectionState,
					connecting: false,
					reconnecting: false,
				};
			});
			this.throttle.setInFlightConnect(false);
			return;
		}

		logger.info('Attempting to connect to LiveKit', {endpoint, guildId, channelId});

		room
			.connect(endpoint, token, {autoSubscribe: false})
			.then(() => {
				logger.info('LiveKit connection succeeded');
				if (!this.throttle.isLatestAttempt(roomAttemptId)) {
					logger.warn('Connection succeeded but attempt is stale, disconnecting');
					try {
						room.removeAllListeners();
						room.disconnect();
					} catch {}
					return;
				}
				logger.info('Initializing voice connection');
				runInAction(() => {
					this.connectionState = {
						...this.connectionState,
						room,
					};
				});
			})
			.catch((error) => {
				logger.error('LiveKit connection failed', {error, endpoint});
				if (this.throttle.isLatestAttempt(roomAttemptId)) {
					runInAction(() => {
						this.connectionState = {
							...this.connectionState,
							connecting: false,
							reconnecting: false,
						};
					});
					this.throttle.setInFlightConnect(false);
					this.reconnect.setReconnectState('error');
					onConnectionFailed?.();
				}
			});
	}

	markConnected(): void {
		runInAction(() => {
			this.connectionState = {
				...this.connectionState,
				connected: true,
				connecting: false,
				reconnecting: false,
			};
		});
		this.throttle.setInFlightConnect(false);
		this.reconnect.resetOnConnection();
		logger.info('Connection established');
	}

	markDisconnected(reason: 'user' | 'error' | 'server' = 'user'): void {
		runInAction(() => {
			this.connectionState = {...initialConnectionState};
		});
		this.throttle.setInFlightConnect(false);
		this.reconnect.setReconnectState(reason);
		logger.info('Connection terminated', {reason});
	}

	markReconnecting(): void {
		runInAction(() => {
			this.connectionState = {
				...this.connectionState,
				connecting: true,
				connected: false,
				reconnecting: true,
			};
		});
		logger.info('Connection reconnecting');
	}

	markReconnected(): void {
		runInAction(() => {
			this.connectionState = {
				...this.connectionState,
				connecting: false,
				connected: true,
				reconnecting: false,
			};
		});
		this.reconnect.resetOnConnection();
		logger.info('Connection reconnected');
	}

	disconnectFromVoiceChannel(reason: 'user' | 'error' | 'server' = 'user'): void {
		const {room} = this.connectionState;

		this.isLocalDisconnecting = reason === 'user';

		this.clearVoiceServerTimeout();

		if (room) {
			room.removeAllListeners();
			room.disconnect();
		}

		runInAction(() => {
			this.connectionState = {...initialConnectionState};
		});

		this.reconnect.setReconnectState(reason);

		this.isLocalDisconnecting = false;
		logger.info('Disconnected from voice channel', {reason});
	}

	scheduleReconnect(callback: () => void): boolean {
		return this.reconnect.scheduleReconnect(callback);
	}

	markReconnectionAttempted(): void {
		this.reconnect.markAttempted();
	}

	resetReconnectState(): void {
		this.reconnect.reset();
	}

	updateChannelId(channelId: string): void {
		runInAction(() => {
			this.connectionState = {
				...this.connectionState,
				channelId,
				connected: false,
				connecting: true,
				reconnecting: false,
				room: null,
			};
		});
		logger.info('Channel updated', {channelId});
	}

	createGuardedHandler<T extends ReadonlyArray<unknown>>(
		attemptId: number,
		handler: (...args: T) => void,
	): (...args: T) => void {
		return (...args: T) => {
			if (!this.throttle.isLatestAttempt(attemptId)) {
				return;
			}
			handler(...args);
		};
	}

	bindConnectionEvents(
		room: Room,
		attemptId: number,
		handlers: {
			onConnected: () => void;
			onDisconnected: (reason?: unknown) => void;
			onReconnecting: () => void;
			onReconnected: () => void;
		},
	): void {
		room.on(RoomEvent.Connected, this.createGuardedHandler(attemptId, handlers.onConnected));
		room.on(RoomEvent.Disconnected, this.createGuardedHandler(attemptId, handlers.onDisconnected));
		room.on(RoomEvent.Reconnecting, this.createGuardedHandler(attemptId, handlers.onReconnecting));
		room.on(RoomEvent.Reconnected, this.createGuardedHandler(attemptId, handlers.onReconnected));
	}

	resetConnectionState(): void {
		runInAction(() => {
			this.connectionState = initialConnectionState;
		});
		this.isLocalDisconnecting = false;
		this.throttle.setInFlightConnect(false);
	}

	clearInFlightConnect(): void {
		this.throttle.setInFlightConnect(false);
	}

	abortConnection(): void {
		this.clearVoiceServerTimeout();

		runInAction(() => {
			this.connectionState = {
				...initialConnectionState,
				connectionId: null,
			};
		});

		this.isLocalDisconnecting = false;
		this.throttle.setInFlightConnect(false);
		logger.info('Connection aborted due to gateway error');
	}

	private scheduleVoiceServerTimeout(guildId: string | null, channelId: string): void {
		this.clearVoiceServerTimeout();
		this.voiceServerTimeoutSub = timer(VOICE_SERVER_TIMEOUT_MS).subscribe(() => {
			runInAction(() => {
				if (
					this.connectionState.guildId === guildId &&
					this.connectionState.channelId === channelId &&
					!this.connectionState.connected
				) {
					logger.warn('Voice server timeout', {guildId, channelId});
					this.connectionState = {
						...this.connectionState,
						connecting: false,
						connected: false,
						reconnecting: false,
						guildId: null,
						channelId: null,
						connectionId: null,
					};
					this.throttle.setInFlightConnect(false);
					this.reconnect.setReconnectState('error');
				}
			});
		});
	}

	private clearVoiceServerTimeout(): void {
		this.voiceServerTimeoutSub?.unsubscribe();
		this.voiceServerTimeoutSub = null;
	}

	cleanup(): void {
		const {room} = this.connectionState;

		this.clearVoiceServerTimeout();

		if (room) {
			room.removeAllListeners();
			room.disconnect();
		}

		runInAction(() => {
			this.connectionState = initialConnectionState;
		});

		this.isLocalDisconnecting = false;
		this.throttle.reset();
		this.reconnect.cleanup();

		logger.info('Cleanup complete');
	}
}

export default new VoiceConnectionManager();
