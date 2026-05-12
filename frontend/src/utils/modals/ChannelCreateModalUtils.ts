/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageDescriptor} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import * as ChannelActionCreators from '~/actions/ChannelActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {selectChannel} from '~/actions/NavigationActionCreators';
import {ChannelTypes} from '~/Constants';
import {Routes} from '~/Routes';
import * as RouterUtils from '~/utils/RouterUtils';

export interface FormInputs {
	name: string;
	type: string;
}

export interface ChannelTypeOption {
	value: number;
	name: string;
	desc: string;
}

export const getChannelTypeOptions = (t: (msg: MessageDescriptor) => string): Array<ChannelTypeOption> => [
	{
		value: ChannelTypes.GUILD_TEXT,
		name: t(msg`Text Channel`),
		desc: t(msg`Send messages, images, GIFs, and emoji`),
	},
	{
		value: ChannelTypes.GUILD_VOICE,
		name: t(msg`Voice Channel`),
		desc: t(msg`Hang out together with voice, video, and screen share`),
	},
];

export const createChannel = async (guildId: string, data: FormInputs, parentId?: string): Promise<void> => {
	const channelType = Number(data.type);
	const channel = await ChannelActionCreators.create(guildId, {
		name: data.name,
		type: channelType,
		parent_id: parentId || null,
		bitrate: channelType === ChannelTypes.GUILD_VOICE ? 64000 : null,
		user_limit: channelType === ChannelTypes.GUILD_VOICE ? 0 : null,
	});

	if (channel.type === ChannelTypes.GUILD_TEXT || channel.type === ChannelTypes.GUILD_VOICE) {
		setTimeout(() => {
			RouterUtils.transitionTo(Routes.guildChannel(guildId, channel.id));
			selectChannel(guildId, channel.id);
		}, 50);
	}

	ModalActionCreators.pop();
};

export const getDefaultValues = (): Partial<FormInputs> => ({
	type: ChannelTypes.GUILD_TEXT.toString(),
});
