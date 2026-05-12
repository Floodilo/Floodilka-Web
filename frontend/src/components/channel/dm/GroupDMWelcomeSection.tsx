/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {NotePencilIcon, UserPlusIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {useCallback} from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {GroupDMAvatar} from '~/components/common/GroupDMAvatar';
import {AddFriendsToGroupModal} from '~/components/modals/AddFriendsToGroupModal';
import {EditGroupModal} from '~/components/modals/EditGroupModal';
import {Button} from '~/components/uikit/Button/Button';
import type {ChannelRecord} from '~/records/ChannelRecord';
import * as ChannelUtils from '~/utils/ChannelUtils';
import {MAX_GROUP_DM_RECIPIENTS} from '~/utils/groupDmUtils';
import styles from './GroupDMWelcomeSection.module.css';

interface GroupDMWelcomeSectionProps {
	channel: ChannelRecord;
}

export const GroupDMWelcomeSection: React.FC<GroupDMWelcomeSectionProps> = observer(({channel}) => {
	const displayName = ChannelUtils.getDMDisplayName(channel);
	const isGroupDMFull = channel.recipientIds.length + 1 >= MAX_GROUP_DM_RECIPIENTS;

	const handleOpenEditGroup = useCallback(() => {
		ModalActionCreators.push(modal(() => <EditGroupModal channelId={channel.id} />));
	}, [channel.id]);

	const handleAddFriends = useCallback(() => {
		ModalActionCreators.push(modal(() => <AddFriendsToGroupModal channelId={channel.id} />));
	}, [channel.id]);

	return (
		<div className={styles.welcomeSection}>
			<div className={styles.profileSection}>
				<GroupDMAvatar channel={channel} size={80} />

				<span className={styles.groupName}>{displayName}</span>
			</div>

			<p className={styles.welcomeText}>
				<Trans>
					This is the beginning of <strong>{displayName}</strong>. Add friends to start a conversation!
				</Trans>
			</p>

			<div className={styles.actions}>
				<Button
					variant="secondary"
					leftIcon={<NotePencilIcon size={18} weight="bold" />}
					onClick={handleOpenEditGroup}
					fitContainer={false}
					fitContent
				>
					<Trans>Edit Group</Trans>
				</Button>

				{!isGroupDMFull && (
					<Button
						variant="primary"
						leftIcon={<UserPlusIcon size={18} weight="bold" />}
						onClick={handleAddFriends}
						fitContainer={false}
						fitContent
					>
						<Trans>Add Friends to Group</Trans>
					</Button>
				)}
			</div>
		</div>
	);
});
