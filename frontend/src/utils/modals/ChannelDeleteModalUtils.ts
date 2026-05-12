/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import * as ChannelActionCreators from '~/actions/ChannelActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {ChannelTypes} from '~/Constants';
import ChannelStore from '~/stores/ChannelStore';

export interface ChannelDeleteModalProps {
	channelId: string;
}

export const deleteChannel = async (channelId: string): Promise<void> => {
	const channel = ChannelStore.getChannel(channelId);
	if (!channel) return;

	await ChannelActionCreators.remove(channelId);
	ModalActionCreators.popAll();

	ToastActionCreators.createToast({
		type: 'success',
		children: channel.type === ChannelTypes.GUILD_CATEGORY ? 'Category deleted' : 'Channel deleted',
	});
};

export const getChannelDeleteInfo = (channelId: string) => {
	const channel = ChannelStore.getChannel(channelId);
	if (!channel) return null;

	const isCategory = channel.type === ChannelTypes.GUILD_CATEGORY;
	const title = isCategory ? 'Delete category' : 'Delete channel';
	const confirmText = isCategory ? 'Delete category' : 'Delete channel';
	const successMessage = isCategory ? 'Category deleted' : 'Channel deleted';

	return {
		channel,
		isCategory,
		title,
		confirmText,
		successMessage,
	};
};
