/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {SmileySadIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import {useParams} from '~/lib/router';
import ChannelStore from '~/stores/ChannelStore';
import GuildStore from '~/stores/GuildStore';
import styles from './ChannelLayout.module.css';

export const ChannelLayout = observer(({children}: {children: React.ReactNode}) => {
	const {guildId: routeGuildId, channelId} = useParams() as {guildId?: string; channelId: string};
	const channel = ChannelStore.getChannel(channelId);
	const guildId = routeGuildId || channel?.guildId;
	const guild = guildId ? GuildStore.getGuild(guildId) : null;

	if (guild && !channel) {
		return (
			<div className={styles.channelNotFoundContainer}>
				<div className={styles.channelNotFoundContent}>
					<SmileySadIcon className={styles.channelNotFoundIcon} />
					<h1 className={styles.channelNotFoundTitle}>
						<Trans>This is not the channel you're looking for.</Trans>
					</h1>
					<p className={styles.channelNotFoundDescription}>
						<Trans>The channel you're looking for may have been deleted or you may not have access to it.</Trans>
					</p>
				</div>
			</div>
		);
	}

	return <div className={styles.channelLayoutContainer}>{children}</div>;
});
