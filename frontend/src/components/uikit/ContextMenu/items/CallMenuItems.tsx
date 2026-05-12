/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {PhoneIcon, PhoneXIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import type {PressEvent} from 'react-aria-components';
import * as CallActionCreators from '~/actions/CallActionCreators';
import * as PrivateChannelActionCreators from '~/actions/PrivateChannelActionCreators';
import type {UserRecord} from '~/records/UserRecord';
import CallStateStore from '~/stores/CallStateStore';
import * as CallUtils from '~/utils/CallUtils';
import {VideoCallIcon, VoiceCallIcon} from '../ContextMenuIcons';
import {MenuItem} from '../MenuItem';
import styles from './MenuItems.module.css';

interface StartVoiceCallMenuItemProps {
	user: UserRecord;
	onClose: () => void;
}

export const StartVoiceCallMenuItem: React.FC<StartVoiceCallMenuItemProps> = observer(({user, onClose}) => {
	const {t} = useLingui();
	const handleStartVoiceCall = React.useCallback(
		async (event: PressEvent) => {
			onClose();
			try {
				const channelId = await PrivateChannelActionCreators.ensureDMChannel(user.id);
				await CallUtils.checkAndStartCall(channelId, event.shiftKey);
			} catch (error) {
				console.error('Failed to start voice call:', error);
			}
		},
		[user.id, onClose],
	);

	if (user.bot) {
		return null;
	}

	return (
		<MenuItem icon={<VoiceCallIcon />} onClick={handleStartVoiceCall}>
			{t`Start Voice Call`}
		</MenuItem>
	);
});

interface StartVideoCallMenuItemProps {
	user: UserRecord;
	onClose: () => void;
}

export const StartVideoCallMenuItem: React.FC<StartVideoCallMenuItemProps> = observer(({user, onClose}) => {
	const {t} = useLingui();
	const handleStartVideoCall = React.useCallback(
		async (event: PressEvent) => {
			onClose();
			try {
				const channelId = await PrivateChannelActionCreators.ensureDMChannel(user.id);
				await CallUtils.checkAndStartCall(channelId, event.shiftKey);
			} catch (error) {
				console.error('Failed to start video call:', error);
			}
		},
		[user.id, onClose],
	);

	if (user.bot) {
		return null;
	}

	return (
		<MenuItem icon={<VideoCallIcon />} onClick={handleStartVideoCall}>
			{t`Start Video Call`}
		</MenuItem>
	);
});

interface RingUserMenuItemProps {
	userId: string;
	channelId: string;
	onClose: () => void;
}

export const RingUserMenuItem: React.FC<RingUserMenuItemProps> = observer(({userId, channelId, onClose}) => {
	const {t} = useLingui();
	const call = CallStateStore.getCall(channelId);
	const participants = call ? CallStateStore.getParticipants(channelId) : [];
	const isInCall = participants.includes(userId);
	const isRinging = call?.ringing.includes(userId) ?? false;

	const handleRing = React.useCallback(async () => {
		onClose();
		try {
			await CallActionCreators.ringParticipants(channelId, [userId]);
		} catch (error) {
			console.error('Failed to ring user:', error);
		}
	}, [channelId, userId, onClose]);

	const handleStopRinging = React.useCallback(async () => {
		onClose();
		try {
			await CallActionCreators.stopRingingParticipants(channelId, [userId]);
		} catch (error) {
			console.error('Failed to stop ringing user:', error);
		}
	}, [channelId, userId, onClose]);

	if (!call || isInCall) return null;

	if (isRinging) {
		return (
			<MenuItem icon={<PhoneXIcon weight="fill" className={styles.icon} />} onClick={handleStopRinging}>
				{t`Stop Ringing`}
			</MenuItem>
		);
	}

	return (
		<MenuItem icon={<PhoneIcon weight="fill" className={styles.icon} />} onClick={handleRing}>
			{t`Ring`}
		</MenuItem>
	);
});
