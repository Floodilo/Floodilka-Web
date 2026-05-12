/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import type {Icon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {MessageReactions} from '~/components/channel/MessageReactions';
import {TimestampWithTooltip} from '~/components/channel/TimestampWithTooltip';
import type {MessageRecord} from '~/records/MessageRecord';
import UserSettingsStore from '~/stores/UserSettingsStore';
import styles from '~/styles/Message.module.css';
import * as DateUtils from '~/utils/DateUtils';

export const SystemMessage = observer(
	({
		icon: Icon,
		iconWeight,
		iconClassname,
		message,
		messageContent,
	}: {
		icon: Icon;
		iconWeight: 'bold' | 'fill';
		iconClassname?: string;
		message: MessageRecord;
		messageContent: React.ReactNode;
	}) => {
		const {i18n} = useLingui();
		const messageDisplayCompact = UserSettingsStore.getMessageDisplayCompact();
		const formattedDate = messageDisplayCompact
			? DateUtils.getFormattedTime(message.timestamp)
			: DateUtils.getRelativeDateString(message.timestamp, i18n);

		if (messageDisplayCompact) {
			return (
				<div className={styles.systemMessageCompactContent}>
					<TimestampWithTooltip date={message.timestamp} className={styles.messageTimestampCompact}>
						{formattedDate}
					</TimestampWithTooltip>
					<div className={styles.systemMessageIconCompact}>
						<Icon weight={iconWeight} className={clsx(styles.systemMessageIconSvg, iconClassname)} />
					</div>
					<div className={styles.systemMessageContentWrapper}>
						<div className={styles.systemMessageContent}>{messageContent}</div>
						{UserSettingsStore.getRenderReactions() && message.reactions.length > 0 && (
							<div className={styles.container}>
								<MessageReactions message={message} />
							</div>
						)}
					</div>
				</div>
			);
		}

		return (
			<>
				<div className={styles.messageGutterLeft} />
				<div className={styles.systemMessageIconWrapper}>
					<Icon weight={iconWeight} className={clsx(styles.systemMessageIconSvg, iconClassname)} />
				</div>
				<div className={styles.messageGutterRight} />
				<div className={styles.systemMessageContent}>
					{messageContent}{' '}
					<TimestampWithTooltip
						date={message.timestamp}
						className={clsx(styles.messageTimestamp, styles.systemMessageTimestamp)}
					>
						{formattedDate}
					</TimestampWithTooltip>
				</div>
				{UserSettingsStore.getRenderReactions() && message.reactions.length > 0 && (
					<div className={styles.container}>
						<MessageReactions message={message} />
					</div>
				)}
			</>
		);
	},
);
