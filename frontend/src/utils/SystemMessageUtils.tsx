/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {I18n} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import React from 'react';
import {MessageTypes} from '~/Constants';
import UserStore from '~/stores/UserStore';
import * as SnowflakeUtils from '~/utils/SnowflakeUtils';

interface StringifyableMessage {
	id: string;
	type: number;
	content: string;
	author: {id: string};
	mentions?: ReadonlyArray<{id: string}>;
}

const getGuildJoinMessagesPlaintext = (i18n: I18n): Array<(username: string) => string> => [
	(username) => i18n._(msg`Hey, ${username}! Make yourself at home.`),
	(username) => i18n._(msg`${username} stopped by — it just got cozier!`),
	(username) => i18n._(msg`Welcome, ${username}! We've been waiting for you.`),
	(username) => i18n._(msg`${username} is now with us! Finally.`),
	(username) => i18n._(msg`Oh, ${username}! Come in, don't be shy.`),
	(username) => i18n._(msg`${username} showed up! The day just got better.`),
	(username) => i18n._(msg`Everyone meet ${username}! Applause.`),
	(username) => i18n._(msg`${username} is here! Someone called for backup.`),
	(username) => i18n._(msg`${username} joins! One more cool person in the house.`),
	(username) => i18n._(msg`Wow, ${username} is here! The party begins.`),
	(username) => i18n._(msg`${username} is in! Alright, we can start now.`),
	(username) => i18n._(msg`Hey, ${username}! We already missed you.`),
	(username) => i18n._(msg`${username} walked in! The kettle is on.`),
	(username) => i18n._(msg`Welcome, ${username}! The window seat is free.`),
	(username) => i18n._(msg`${username} barges in! Well, gently barges in.`),
	(username) => i18n._(msg`${username} is here! It just got warmer somehow.`),
	(username) => i18n._(msg`Good to see you, ${username}! Make yourself comfortable.`),
	(username) => i18n._(msg`${username} rolls up! The crew is growing.`),
	(username) => i18n._(msg`Hey, ${username}! You're gonna like it here.`),
	(username) => i18n._(msg`${username} is here! The puzzle is complete.`),
];

export const SystemMessageUtils = {
	getGuildJoinMessage(messageId: string, username: React.ReactNode, i18n: I18n): React.ReactElement {
		const messageList = getGuildJoinMessagesPlaintext(i18n);
		const messageIndex = SnowflakeUtils.extractTimestamp(messageId) % messageList.length;
		const messageGenerator = messageList[messageIndex];
		return (
			<>
				{messageGenerator('__USERNAME__')
					.split('__USERNAME__')
					.map((part, i, arr) => (
						<React.Fragment key={i}>
							{part}
							{i < arr.length - 1 && username}
						</React.Fragment>
					))}
			</>
		);
	},

	stringify(message: StringifyableMessage, i18n: I18n): string | null {
		const author = UserStore.getUser(message.author.id);
		if (!author) return null;

		const username = author.username;

		switch (message.type) {
			case MessageTypes.USER_JOIN: {
				const messageList = getGuildJoinMessagesPlaintext(i18n);
				const messageIndex = SnowflakeUtils.extractTimestamp(message.id) % messageList.length;
				const messageGenerator = messageList[messageIndex];
				return messageGenerator(username);
			}
			case MessageTypes.CHANNEL_PINNED_MESSAGE:
				return i18n._(msg`${username} pinned a message to this channel.`);
			case MessageTypes.RECIPIENT_ADD: {
				const mentionedUser =
					message.mentions && message.mentions.length > 0 ? UserStore.getUser(message.mentions[0].id) : null;
				if (mentionedUser) {
					return i18n._(msg`${username} added ${mentionedUser.username} to the group.`);
				}
				return i18n._(msg`${username} added someone to the group.`);
			}
			case MessageTypes.RECIPIENT_REMOVE: {
				const mentionedUserId = message.mentions && message.mentions.length > 0 ? message.mentions[0].id : null;
				const isSelfRemove = mentionedUserId === message.author.id;
				if (isSelfRemove) {
					return i18n._(msg`${username} has left the group.`);
				}
				const mentionedUser = mentionedUserId ? UserStore.getUser(mentionedUserId) : null;
				if (mentionedUser) {
					return i18n._(msg`${username} removed ${mentionedUser.username} from the group.`);
				}
				return i18n._(msg`${username} removed someone from the group.`);
			}
			case MessageTypes.CHANNEL_NAME_CHANGE: {
				const newName = message.content;
				if (newName) {
					return i18n._(msg`${username} changed the channel name to ${newName}.`);
				}
				return i18n._(msg`${username} changed the channel name.`);
			}
			case MessageTypes.CHANNEL_ICON_CHANGE:
				return i18n._(msg`${username} changed the channel icon.`);
			case MessageTypes.CALL:
				return i18n._(msg`${username} started a call.`);
			default:
				return null;
		}
	},
};
