/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';

import {PhoneIcon, VideoCameraIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as CallActionCreators from '~/actions/CallActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {ChannelTypes} from '~/Constants';
import type {ChannelRecord} from '~/records/ChannelRecord';
import CallStateStore from '~/stores/CallStateStore';
import UserStore from '~/stores/UserStore';
import MediaEngineStore from '~/stores/voice/MediaEngineFacade';
import * as CallUtils from '~/utils/CallUtils';
import {ChannelHeaderIcon} from './ChannelHeaderIcon';

const VoiceCallButton = observer(({channel}: {channel: ChannelRecord}) => {
	const {t} = useLingui();
	const call = CallStateStore.getCall(channel.id);
	const isConnected = MediaEngineStore.connected;
	const connectedChannelId = MediaEngineStore.channelId;
	const isInCall = isConnected && connectedChannelId === channel.id;
	const hasActiveCall = CallStateStore.hasActiveCall(channel.id);
	const participants = call ? CallStateStore.getParticipants(channel.id) : [];
	const participantCount = participants.length;
	const currentUser = UserStore.getCurrentUser();
	const isUnclaimed = !(currentUser?.isClaimed() ?? false);
	const is1to1 = channel.type === ChannelTypes.DM;
	const blocked = isUnclaimed && is1to1;

	const handleClick = React.useCallback(
		async (event: React.MouseEvent) => {
			if (blocked) {
				ToastActionCreators.createToast({
					type: 'error',
					children: t`Claim your account to start or join 1:1 calls.`,
				});
				return;
			}
			if (isInCall) {
				void CallActionCreators.leaveCall(channel.id);
			} else if (hasActiveCall) {
				CallActionCreators.joinCall(channel.id);
			} else {
				const silent = event.shiftKey;
				await CallUtils.checkAndStartCall(channel.id, silent);
			}
		},
		[channel.id, isInCall, hasActiveCall, blocked],
	);

	let label: string;
	if (participantCount > 0 && hasActiveCall) {
		if (isInCall) {
			label =
				participantCount === 1
					? t`Leave Voice Call (${participantCount} participant)`
					: t`Leave Voice Call (${participantCount} participants)`;
		} else {
			label =
				participantCount === 1
					? t`Join Voice Call (${participantCount} participant)`
					: t`Join Voice Call (${participantCount} participants)`;
		}
	} else {
		label = blocked
			? t`Claim your account to call`
			: isInCall
				? t`Leave Voice Call`
				: hasActiveCall
					? t`Join Voice Call`
					: t`Start Voice Call`;
	}

	return (
		<ChannelHeaderIcon
			icon={PhoneIcon}
			label={label}
			isSelected={isInCall}
			onClick={handleClick}
			disabled={blocked}
			keybindAction="start_pm_call"
		/>
	);
});

const VideoCallButton = observer(({channel}: {channel: ChannelRecord}) => {
	const {t} = useLingui();
	const call = CallStateStore.getCall(channel.id);
	const isConnected = MediaEngineStore.connected;
	const connectedChannelId = MediaEngineStore.channelId;
	const isInCall = isConnected && connectedChannelId === channel.id;
	const hasActiveCall = CallStateStore.hasActiveCall(channel.id);
	const participants = call ? CallStateStore.getParticipants(channel.id) : [];
	const participantCount = participants.length;
	const currentUser = UserStore.getCurrentUser();
	const isUnclaimed = !(currentUser?.isClaimed() ?? false);
	const is1to1 = channel.type === ChannelTypes.DM;
	const blocked = isUnclaimed && is1to1;

	const handleClick = React.useCallback(
		async (event: React.MouseEvent) => {
			if (blocked) {
				ToastActionCreators.createToast({
					type: 'error',
					children: t`Claim your account to start or join 1:1 calls.`,
				});
				return;
			}
			if (isInCall) {
				void CallActionCreators.leaveCall(channel.id);
			} else if (hasActiveCall) {
				CallActionCreators.joinCall(channel.id);
			} else {
				const silent = event.shiftKey;
				await CallUtils.checkAndStartCall(channel.id, silent);
			}
		},
		[channel.id, isInCall, hasActiveCall, blocked],
	);

	let label: string;
	if (participantCount > 0 && hasActiveCall) {
		if (isInCall) {
			label =
				participantCount === 1
					? t`Leave Video Call (${participantCount} participant)`
					: t`Leave Video Call (${participantCount} participants)`;
		} else {
			label =
				participantCount === 1
					? t`Join Video Call (${participantCount} participant)`
					: t`Join Video Call (${participantCount} participants)`;
		}
	} else {
		label = blocked
			? t`Claim your account to call`
			: isInCall
				? t`Leave Video Call`
				: hasActiveCall
					? t`Join Video Call`
					: t`Start Video Call`;
	}

	return (
		<ChannelHeaderIcon
			icon={VideoCameraIcon}
			label={label}
			isSelected={isInCall}
			onClick={handleClick}
			disabled={blocked}
		/>
	);
});

export const CallButtons = {
	VoiceCallButton,
	VideoCallButton,
};
