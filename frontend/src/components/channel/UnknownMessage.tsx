/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {WarningCircleIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import {MessageAvatar} from '~/components/channel/MessageAvatar';
import {MessageUsername} from '~/components/channel/MessageUsername';
import {TimestampWithTooltip} from '~/components/channel/TimestampWithTooltip';
import {UserTag} from '~/components/channel/UserTag';
import GuildMemberStore from '~/stores/GuildMemberStore';
import GuildStore from '~/stores/GuildStore';
import UserStore from '~/stores/UserStore';
import styles from '~/styles/Message.module.css';
import * as DateUtils from '~/utils/DateUtils';
import {useMessageViewContext} from './MessageViewContext';

export const UnknownMessage = observer(() => {
	const {i18n} = useLingui();
	const {message, channel, shouldGroup, isHovering, previewContext, previewOverrides} = useMessageViewContext();
	const userAuthor = UserStore.getUser(message.author.id);
	const author = message.webhookId != null ? message.author : (userAuthor ?? message.author);
	const formattedDate = DateUtils.getRelativeDateString(message.timestamp, i18n);
	const guild = GuildStore.getGuild(channel.guildId ?? '');
	const member = GuildMemberStore.getMember(guild?.id ?? '', author?.id ?? '');

	return (
		<>
			{!shouldGroup && (
				<>
					<div className={styles.messageGutterLeft} />
					<MessageAvatar
						user={author}
						message={message}
						guildId={guild?.id}
						size={40}
						className={styles.messageAvatar}
						isHovering={isHovering}
						isPreview={!!previewContext}
					/>
					<div className={styles.messageGutterRight} />
				</>
			)}

			<div className={styles.messageContent}>
				<h3 className={styles.messageAuthorInfo}>
					<span className={styles.authorContainer}>
						<MessageUsername
							user={author}
							message={message}
							guild={guild}
							member={member ?? undefined}
							className={styles.messageUsername}
							isPreview={!!previewContext}
							previewColor={previewOverrides?.usernameColor}
							previewName={previewOverrides?.displayName}
						/>
						{author.bot && <UserTag className={styles.userTagOffset} system={author.system} />}
					</span>
					<TimestampWithTooltip date={message.timestamp} className={styles.messageTimestamp}>
						{formattedDate}
					</TimestampWithTooltip>
				</h3>
				<div className={styles.messageText}>
					<div className={styles.unknownMessageWarning}>
						<WarningCircleIcon size={16} weight="fill" />
						<span>
							<Trans>Please update Флудилка to view this message.</Trans>
						</span>
					</div>
				</div>
			</div>
		</>
	);
});
