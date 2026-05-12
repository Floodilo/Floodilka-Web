/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {FlagCheckeredIcon, SparkleIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {MessagePreviewContext} from '~/Constants';
import {ChannelHeader} from '~/components/channel/ChannelHeader';
import {Message} from '~/components/channel/Message';
import previewStyles from '~/components/shared/MessagePreview.module.css';
import {Scroller} from '~/components/uikit/Scroller';
import {Routes} from '~/Routes';
import type {MessageRecord} from '~/records/MessageRecord';
import ChannelStore from '~/stores/ChannelStore';
import {goToMessage} from '~/utils/MessageNavigator';
import * as RouterUtils from '~/utils/RouterUtils';
import styles from './MessageListPage.module.css';

interface MessageListPageProps {
	icon: React.ReactNode;
	title: string;
	messages: Array<MessageRecord>;
	emptyStateTitle: string;
	emptyStateDescription: string;
	endStateDescription: string;
	renderActionButtons: (message: MessageRecord) => React.ReactNode;
	renderMissingMessage?: (message: MessageRecord) => React.ReactNode;
}

export const MessageListPage = observer(
	({
		icon,
		title,
		messages,
		emptyStateTitle,
		emptyStateDescription,
		endStateDescription,
		renderActionButtons,
		renderMissingMessage,
	}: MessageListPageProps) => {
		const {t} = useLingui();
		const leftContent = (
			<div className={styles.header}>
				{icon}
				<span className={styles.title}>{title}</span>
			</div>
		);

		return (
			<div className={styles.container}>
				<ChannelHeader leftContent={leftContent} showPins={false} />

				<div className={styles.content}>
					{messages.length > 0 ? (
						<Scroller className={styles.scroller} key="message-list-page-scroller">
							{messages.map((message) => {
								const channel = ChannelStore.getChannel(message.channelId);
								if (!channel) {
									if (renderMissingMessage) {
										return renderMissingMessage(message);
									}
									return null;
								}

								return (
									<div key={message.id} className={previewStyles.previewCard}>
										<Message message={message} channel={channel} previewContext={MessagePreviewContext.LIST_POPOUT} />
										<div className={previewStyles.actionButtons}>
											<button
												type="button"
												className={previewStyles.actionButton}
												onClick={() => {
													const path = channel.guildId
														? Routes.guildChannel(channel.guildId, channel.id)
														: Routes.dmChannel(channel.id);
													RouterUtils.transitionTo(path);
													goToMessage(message.channelId, message.id);
												}}
											>
												{t`Jump`}
											</button>

											{renderActionButtons(message)}
										</div>
									</div>
								);
							})}

							<div className={styles.endState}>
								<div className={styles.endStateContent}>
									<FlagCheckeredIcon className={styles.endStateIcon} />
									<div className={styles.endStateText}>
										<h3 className={styles.endStateTitle}>{t`You've reached the end`}</h3>
										<p className={styles.endStateDescription}>{endStateDescription}</p>
									</div>
								</div>
							</div>
						</Scroller>
					) : (
						<div className={styles.emptyState}>
							<div className={styles.emptyStateContent}>
								<SparkleIcon className={styles.emptyStateIcon} />
								<div className={styles.emptyStateText}>
									<h3 className={styles.emptyStateTitle}>{emptyStateTitle}</h3>
									<p className={styles.emptyStateDescription}>{emptyStateDescription}</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		);
	},
);
