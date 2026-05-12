/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {FlagCheckeredIcon, SparkleIcon, XIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as SavedMessageActionCreators from '~/actions/SavedMessageActionCreators';
import {MessagePreviewContext} from '~/Constants';
import {Message} from '~/components/channel/Message';
import {MessageContextPrefix} from '~/components/shared/MessageContextPrefix/MessageContextPrefix';
import previewStyles from '~/components/shared/MessagePreview.module.css';
import {SavedMessageMissingCard} from '~/components/shared/SavedMessageMissingCard';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {Scroller} from '~/components/uikit/Scroller';
import ChannelStore from '~/stores/ChannelStore';
import SavedMessagesStore from '~/stores/SavedMessagesStore';
import {goToMessage} from '~/utils/MessageNavigator';

export const SavedMessagesContent = observer(() => {
	const {t, i18n} = useLingui();
	const {savedMessages, missingSavedMessages, fetched} = SavedMessagesStore;

	const renderMissingSavedMessage = React.useCallback(
		(entryId: string) => (
			<SavedMessageMissingCard
				key={`lost-${entryId}`}
				entryId={entryId}
				onRemove={() => SavedMessageActionCreators.remove(i18n, entryId)}
			/>
		),
		[i18n],
	);

	React.useEffect(() => {
		if (!fetched) {
			SavedMessageActionCreators.fetch();
		}
	}, [fetched]);

	if (!savedMessages.length && !missingSavedMessages.length) {
		return (
			<div className={previewStyles.emptyState}>
				<div className={previewStyles.emptyStateContent}>
					<SparkleIcon className={previewStyles.emptyStateIcon} />
					<div className={previewStyles.emptyStateTextContainer}>
						<h3 className={previewStyles.emptyStateTitle}>{t`No Bookmarks`}</h3>
						<p className={previewStyles.emptyStateDescription}>{t`Bookmark messages to save them for later.`}</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<Scroller className={previewStyles.scroller} key="saved-messages-scroller" reserveScrollbarTrack>
			{missingSavedMessages.map((entry) => renderMissingSavedMessage(entry.id))}
			{savedMessages.map((message) => {
				const channel = ChannelStore.getChannel(message.channelId);

				if (!channel) {
					return renderMissingSavedMessage(message.id);
				}

				return (
					<React.Fragment key={message.id}>
						<MessageContextPrefix
							channel={channel}
							showGuildMeta={Boolean(channel.guildId)}
							compact
							onClick={() => goToMessage(message.channelId, message.id)}
						/>

						<div className={previewStyles.previewCard}>
							<Message message={message} channel={channel} previewContext={MessagePreviewContext.LIST_POPOUT} />

							<div className={previewStyles.actionButtons}>
								<FocusRing offset={-2}>
									<button
										type="button"
										className={previewStyles.actionButton}
										onClick={() => {
											goToMessage(message.channelId, message.id);
										}}
									>
										{t`Jump`}
									</button>
								</FocusRing>

								<FocusRing offset={-2}>
									<button
										type="button"
										className={previewStyles.actionIconButton}
										onClick={() => SavedMessageActionCreators.remove(i18n, message.id)}
									>
										<XIcon weight="regular" className={previewStyles.actionIcon} />
									</button>
								</FocusRing>
							</div>
						</div>
					</React.Fragment>
				);
			})}

			<div className={previewStyles.endState}>
				<div className={previewStyles.endStateContent}>
					<FlagCheckeredIcon className={previewStyles.endStateIcon} />
					<div className={previewStyles.endStateTextContainer}>
						<h3 className={previewStyles.endStateTitle}>{t`You've reached the end`}</h3>
						<p className={previewStyles.endStateDescription}>{t`There's nothing more to see here.`}</p>
					</div>
				</div>
			</div>
		</Scroller>
	);
});
