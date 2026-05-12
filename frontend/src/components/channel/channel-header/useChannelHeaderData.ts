/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import React from 'react';
import {ChannelTypes} from '~/Constants';
import type {ChannelRecord} from '~/records/ChannelRecord';
import type {UserRecord} from '~/records/UserRecord';
import UserStore from '~/stores/UserStore';
import * as ChannelUtils from '~/utils/ChannelUtils';

export interface ChannelHeaderData {
	isDM: boolean;
	isGroupDM: boolean;
	isPersonalNotes: boolean;
	isGuildChannel: boolean;
	isVoiceChannel: boolean;
	recipient: UserRecord | null;
	directMessageName: string;
	groupDMName: string;
	channelName: string;
	channelTypeLabel: string | null;
}

export const useChannelHeaderData = (channel?: ChannelRecord): ChannelHeaderData => {
	const {t} = useLingui();
	const isDM = channel?.type === ChannelTypes.DM;
	const isGroupDM = channel?.type === ChannelTypes.GROUP_DM;
	const isPersonalNotes = channel?.type === ChannelTypes.DM_PERSONAL_NOTES;
	const isGuildChannel = Boolean(channel?.guildId);
	const isVoiceChannel = Boolean(channel?.isVoice());

	const recipient = React.useMemo<UserRecord | null>(() => {
		if (!isDM || !channel?.recipientIds?.length) {
			return null;
		}
		return UserStore.getUser(channel.recipientIds[0]) ?? null;
	}, [channel, isDM]);

	const directMessageName = React.useMemo(() => {
		if (!isDM || !recipient) {
			return '';
		}
		return recipient.displayName;
	}, [isDM, recipient]);

	const groupDMName = React.useMemo(() => {
		if (!isGroupDM || !channel) {
			return '';
		}
		return ChannelUtils.getDMDisplayName(channel);
	}, [channel, isGroupDM]);

	const channelName = React.useMemo(() => {
		if (!channel) {
			return '';
		}

		if (isDM && recipient) {
			return directMessageName;
		}

		if (isGroupDM) {
			return groupDMName;
		}

		if (isPersonalNotes) {
			return t`Personal Notes`;
		}

		return channel.name ?? '';
	}, [channel, isDM, isGroupDM, isPersonalNotes, recipient, directMessageName, groupDMName]);

	const channelTypeLabel = React.useMemo(() => {
		if (!channel) {
			return null;
		}

		if (channel.type === ChannelTypes.GUILD_TEXT) {
			return t`Text Channel`;
		}

		if (channel.type === ChannelTypes.GUILD_VOICE) {
			return t`Voice Channel`;
		}

		return null;
	}, [channel]);

	return {
		isDM,
		isGroupDM,
		isPersonalNotes,
		isGuildChannel,
		isVoiceChannel,
		recipient,
		directMessageName,
		groupDMName,
		channelName,
		channelTypeLabel,
	};
};
