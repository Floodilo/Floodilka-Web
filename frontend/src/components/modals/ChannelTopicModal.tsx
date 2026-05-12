/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import confirmStyles from '~/components/modals/ConfirmModal.module.css';
import * as Modal from '~/components/modals/Modal';
import {SafeMarkdown} from '~/lib/markdown';
import {MarkdownContext} from '~/lib/markdown/renderers';
import markupStyles from '~/styles/Markup.module.css';
import {type ChannelTopicModalProps, getChannelTopicInfo} from '~/utils/modals/ChannelTopicModalUtils';
import styles from './ChannelTopicModal.module.css';

export const ChannelTopicModal = observer(({channelId}: ChannelTopicModalProps) => {
	const topicInfo = getChannelTopicInfo(channelId);

	if (!topicInfo) {
		return null;
	}

	const {topic, title} = topicInfo;

	return (
		<Modal.Root size="small" centered>
			<Modal.Header title={title} />
			<Modal.Content className={clsx(confirmStyles.content, styles.selectable)}>
				<div className={clsx(markupStyles.markup, styles.topic)}>
					<SafeMarkdown
						content={topic}
						options={{
							context: MarkdownContext.STANDARD_WITHOUT_JUMBO,
							channelId,
						}}
					/>
				</div>
			</Modal.Content>
		</Modal.Root>
	);
});
