/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Message} from '~/records/MessageRecord';
import AccessibilityStore from '~/stores/AccessibilityStore';
import NotificationStore, {TTSNotificationMode} from '~/stores/NotificationStore';
import SelectedChannelStore from '~/stores/SelectedChannelStore';

class TtsService {
	private synth: SpeechSynthesis | null = null;

	constructor() {
		if ('speechSynthesis' in window) {
			this.synth = window.speechSynthesis;
		}
	}

	isSupported(): boolean {
		return this.synth !== null;
	}

	speak(text: string, rate: number = 1.0): void {
		if (!this.synth) return;

		this.stop();

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.rate = rate;
		this.synth.speak(utterance);
	}

	stop(): void {
		if (!this.synth) return;
		this.synth.cancel();
	}

	isSpeaking(): boolean {
		return this.synth?.speaking ?? false;
	}

	speakMessage(content: string): void {
		if (!content.trim()) return;
		const rate = AccessibilityStore.ttsRate;
		this.speak(content, rate);
	}

	handleIncomingTtsMessage(message: Message): void {
		if (!message.tts) return;
		if (!this.isSupported()) return;

		const mode = NotificationStore.getTTSNotificationMode();
		if (mode === TTSNotificationMode.NEVER) return;

		if (mode === TTSNotificationMode.FOR_CURRENT_CHANNEL) {
			const selectedChannelId = SelectedChannelStore.currentChannelId;
			if (message.channel_id !== selectedChannelId) return;
			this.speakMessage(message.content);
			return;
		}

		if (mode === TTSNotificationMode.FOR_ALL_CHANNELS) {
			this.speakMessage(message.content);
			return;
		}

		this.speakMessage(message.content);
	}
}

const ttsService = new TtsService();

export default ttsService;

export const speak = (text: string, rate?: number): void => ttsService.speak(text, rate);
export const stop = (): void => ttsService.stop();
export const isSpeaking = (): boolean => ttsService.isSpeaking();
export const speakMessage = (content: string): void => ttsService.speakMessage(content);
export const handleIncomingTtsMessage = (message: Message): void => ttsService.handleIncomingTtsMessage(message);
export const isSupported = (): boolean => ttsService.isSupported();
