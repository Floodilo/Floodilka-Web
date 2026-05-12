/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageDescriptor} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {useEffect, useState} from 'react';
import {Typing} from '~/components/channel/Typing';
import {Avatar} from '~/components/uikit/Avatar';
import {AvatarStack} from '~/components/uikit/avatars/AvatarStack';
import {ComponentDispatch} from '~/lib/ComponentDispatch';
import type {ChannelRecord} from '~/records/ChannelRecord';
import type {UserRecord} from '~/records/UserRecord';
import AuthenticationStore from '~/stores/AuthenticationStore';
import DeveloperOptionsStore from '~/stores/DeveloperOptionsStore';
import GuildMemberStore from '~/stores/GuildMemberStore';
import RelationshipStore from '~/stores/RelationshipStore';
import TypingStore from '~/stores/TypingStore';
import UserStore from '~/stores/UserStore';
import messageStyles from '~/styles/Message.module.css';
import * as NicknameUtils from '~/utils/NicknameUtils';
import styles from './TypingUsers.module.css';

const SEVERAL_PEOPLE_DESCRIPTOR = msg`Several people are typing...`;
const HANDFUL_DESCRIPTOR = msg`A handful of keyboard warriors are assembling...`;
const SYMPHONY_DESCRIPTOR = msg`A symphony of clacking keys is underway...`;
const FIESTA_DESCRIPTOR = msg`It's a full-blown typing fiesta in here`;
const APOCALYPSE_DESCRIPTOR = msg`Whoa, it's a typing apocalypse`;

const getDisplayName = (user: UserRecord, guildId?: string | null) => NicknameUtils.getNickname(user, guildId);

export const getTypingText = (
	t: (message: MessageDescriptor) => string,
	typingUsers: Array<UserRecord>,
	channel: ChannelRecord,
) => {
	const [a, b, c] = typingUsers.map((user) => {
		const member = GuildMemberStore.getMember(channel.guildId ?? '', user.id);
		return (
			<span key={user.id} className={styles.username} style={{color: member?.getColorString()}}>
				{getDisplayName(user, channel.guildId)}
			</span>
		);
	});

	if (typingUsers.length === 1) {
		return <Trans>{a} is typing...</Trans>;
	}

	if (typingUsers.length === 2) {
		return (
			<Trans>
				{a} and {b} are typing...
			</Trans>
		);
	}

	if (typingUsers.length === 3) {
		return (
			<Trans>
				{a}, {b} and {c} are typing...
			</Trans>
		);
	}

	if (typingUsers.length === 4) {
		return t(SEVERAL_PEOPLE_DESCRIPTOR);
	}

	if (typingUsers.length > 4 && typingUsers.length < 10) {
		return t(HANDFUL_DESCRIPTOR);
	}

	if (typingUsers.length > 9 && typingUsers.length < 15) {
		return t(SYMPHONY_DESCRIPTOR);
	}

	if (typingUsers.length > 14 && typingUsers.length < 20) {
		return t(FIESTA_DESCRIPTOR);
	}

	return t(APOCALYPSE_DESCRIPTOR);
};

export const usePresentableTypingUsers = (channel: ChannelRecord) => {
	const typingUserIds = TypingStore.getTypingUsers(channel.id);
	const currentUserId = AuthenticationStore.currentUserId;
	const showSelf = DeveloperOptionsStore.showMyselfTyping;
	const filteredTypingUserIds = typingUserIds.filter(
		(userId) => (showSelf || userId !== currentUserId) && !RelationshipStore.isBlocked(userId),
	);
	return [...filteredTypingUserIds]
		.map((userId) => UserStore.getUser(userId))
		.filter((user): user is UserRecord => user != null);
};

const AVATAR_THRESHOLD = 5;

export const TypingUsers = observer(
	({
		channel,
		withText = true,
		showAvatars = true,
	}: {
		channel: ChannelRecord;
		withText?: boolean;
		showAvatars?: boolean;
	}) => {
		const {t} = useLingui();
		const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);

		useEffect(() => {
			const unsubscribe = ComponentDispatch.subscribe('TEXTAREA_AUTOCOMPLETE_CHANGED', (payload?: unknown) => {
				const {channelId, open} = (payload ?? {}) as {channelId?: string; open?: boolean};
				if (channelId === channel.id) {
					setIsAutocompleteOpen(!!open);
				}
			});
			return unsubscribe;
		}, [channel.id]);

		const typingUsers = usePresentableTypingUsers(channel);

		if (typingUsers.length === 0 || isAutocompleteOpen) {
			return null;
		}

		return (
			<div className={`${messageStyles.typingContainer} ${messageStyles.typingCluster}`}>
				<div className={messageStyles.typingPill}>
					<div className={messageStyles.typingIndicator}>
						<Typing
							className={styles.typing}
							size={20}
							style={{
								height: 'var(--typing-indicator-animation-size)',
								width: 'var(--typing-indicator-animation-size)',
							}}
						/>
					</div>

					{withText && (
						<>
							{showAvatars && (
								<AvatarStack size={12} maxVisible={AVATAR_THRESHOLD} className={messageStyles.typingAvatarContainer}>
									{typingUsers.map((user) => (
										<Avatar key={user.id} user={user} size={12} guildId={channel.guildId} />
									))}
								</AvatarStack>
							)}
							<span aria-atomic={true} aria-live="polite" className={messageStyles.typingText}>
								{getTypingText(t, typingUsers, channel)}
							</span>
						</>
					)}
				</div>
			</div>
		);
	},
);
