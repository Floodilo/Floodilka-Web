/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {msg} from '@lingui/core/macro';
import React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import * as PremiumModalActionCreators from '~/actions/PremiumModalActionCreators';
import LocalVoiceStateStore from '~/stores/LocalVoiceStateStore';
import UserStore from '~/stores/UserStore';
import VoiceSettingsStore from '~/stores/VoiceSettingsStore';

export interface ScreenShareSettingsModalSharedProps {
	onStartShare: (
		resolution: 'low' | 'medium' | 'high',
		frameRate: number,
		includeAudio: boolean,
	) => Promise<void>;
}

export const RESOLUTION_OPTIONS = [
	{value: 'low' as const, label: msg`480p`, isPremium: false},
	{value: 'medium' as const, label: msg`720p`, isPremium: false},
	{value: 'high' as const, label: msg`1080p`, isPremium: true},
];

export const FRAMERATE_OPTIONS = [
	{value: 15, label: msg`15 fps`, isPremium: false},
	{value: 24, label: msg`24 fps`, isPremium: false},
	{value: 30, label: msg`30 fps`, isPremium: false},
	{value: 60, label: msg`60 fps`, isPremium: true},
];

export const useScreenShareSettingsModal = ({onStartShare}: ScreenShareSettingsModalSharedProps) => {
	const user = UserStore.currentUser;
	const voiceSettings = VoiceSettingsStore;
	const hasPremium = React.useMemo(() => user?.isPremium() ?? false, [user]);
	const [isSharing, setIsSharing] = React.useState(false);
	const [selectedResolution, setSelectedResolution] = React.useState<'low' | 'medium' | 'high'>(
		!hasPremium && voiceSettings.screenshareResolution === 'high' ? 'medium' : voiceSettings.screenshareResolution,
	);
	const [selectedFrameRate, setSelectedFrameRate] = React.useState<number>(
		!hasPremium && voiceSettings.videoFrameRate > 30 ? 30 : voiceSettings.videoFrameRate,
	);
	const [includeAudio, setIncludeAudio] = React.useState(LocalVoiceStateStore.getSelfStreamAudio());

	const handleStartShare = React.useCallback(async () => {
		setIsSharing(true);
		try {
			LocalVoiceStateStore.updateSelfStreamAudio(includeAudio);
			await onStartShare(selectedResolution, selectedFrameRate, includeAudio);
			ModalActionCreators.pop();
		} catch (error) {
			console.error('Failed to start screen share:', error);
			setIsSharing(false);
		}
	}, [selectedResolution, selectedFrameRate, includeAudio, onStartShare]);

	const handleCancel = React.useCallback(() => {
		ModalActionCreators.pop();
	}, []);

	const handleResolutionClick = React.useCallback(
		(value: 'low' | 'medium' | 'high', isPremium: boolean) => {
			if (isPremium && !hasPremium) {
				PremiumModalActionCreators.open();
				return;
			}
			setSelectedResolution(value);
		},
		[hasPremium],
	);

	const handleFrameRateClick = React.useCallback(
		(value: number, isPremium: boolean) => {
			if (isPremium && !hasPremium) {
				PremiumModalActionCreators.open();
				return;
			}
			setSelectedFrameRate(value);
		},
		[hasPremium],
	);

	return {
		hasPremium,
		isSharing,
		selectedResolution,
		selectedFrameRate,
		includeAudio,
		setIncludeAudio,
		handleStartShare,
		handleCancel,
		handleResolutionClick,
		handleFrameRateClick,
		RESOLUTION_OPTIONS,
		FRAMERATE_OPTIONS,
	};
};
