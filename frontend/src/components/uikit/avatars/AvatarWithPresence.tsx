/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import type {UserRecord} from '~/records/UserRecord';
import GuildMemberStore from '~/stores/GuildMemberStore';
import * as AvatarUtils from '~/utils/AvatarUtils';
import styles from './AvatarWithPresence.module.css';

interface Props {
	user: UserRecord;
	size: number;
	speaking?: boolean;
	className?: string;
	title?: string;
	borderClassName?: string;
	guildId?: string | null;
}

export const AvatarWithPresence: React.FC<Props> = observer(function AvatarWithPresence({
	user,
	size,
	speaking,
	className,
	title,
	borderClassName,
	guildId,
}) {
	const guildMember = GuildMemberStore.getMember(guildId || '', user.id);
	const src =
		guildId && guildMember?.avatar
			? (AvatarUtils.getGuildMemberAvatarURL({
					guildId,
					userId: user.id,
					avatar: guildMember.avatar,
					animated: false,
				}) ?? AvatarUtils.getUserAvatarURL(user, false))
			: AvatarUtils.getUserAvatarURL(user, false);

	return (
		<div
			className={clsx(styles.container, borderClassName, className)}
			style={{width: size, height: size}}
			title={title ?? user.username}
		>
			<div className={clsx(styles.imageWrapper, speaking && styles.imageWrapperSpeaking)}>
				<img src={src} alt={user.username} draggable={false} loading="lazy" decoding="async" className={styles.image} />
			</div>
		</div>
	);
});
