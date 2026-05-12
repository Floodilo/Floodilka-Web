/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import * as ChannelStickerActionCreators from '~/actions/ChannelStickerActionCreators';
import * as MessageActionCreators from '~/actions/MessageActionCreators';
import * as SlowmodeActionCreators from '~/actions/SlowmodeActionCreators';
import {MessageStates, MessageTypes} from '~/Constants';
import {CloudUpload} from '~/lib/CloudUpload';
import type {GuildStickerRecord} from '~/records/GuildStickerRecord';
import {MessageRecord} from '~/records/MessageRecord';
import DraftStore from '~/stores/DraftStore';
import UserStore from '~/stores/UserStore';
import * as SnowflakeUtils from '~/utils/SnowflakeUtils';
import {TypingUtils} from '~/utils/TypingUtils';

export function handleStickerSelect(channelId: string, sticker: GuildStickerRecord): void {
	const draft = DraftStore.getDraft(channelId);
	const hasTextContent = draft && draft.trim().length > 0;
	const hasAttachments = CloudUpload.getTextareaAttachments(channelId).length > 0;

	if (!hasTextContent && !hasAttachments) {
		sendStickerMessage(channelId, sticker);
	} else {
		ChannelStickerActionCreators.setPendingSticker(channelId, sticker);
	}
}

function sendStickerMessage(channelId: string, sticker: GuildStickerRecord): void {
	const nonce = SnowflakeUtils.fromTimestamp(Date.now());
	const currentUser = UserStore.getCurrentUser();

	if (!currentUser) {
		return;
	}

	TypingUtils.clear(channelId);

	const message = new MessageRecord({
		id: nonce,
		channel_id: channelId,
		author: currentUser,
		type: MessageTypes.DEFAULT,
		flags: 0,
		pinned: false,
		mention_everyone: false,
		content: '',
		timestamp: new Date().toISOString(),
		mentions: [],
		state: MessageStates.SENDING,
		nonce,
		attachments: [],
		stickers: [sticker.toJSON()],
	});

	MessageActionCreators.createOptimistic(channelId, message.toJSON());
	SlowmodeActionCreators.recordMessageSend(channelId);

	MessageActionCreators.send(channelId, {
		content: '',
		nonce,
		stickers: [sticker.toJSON()],
	});
}
