/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {RelationshipTypes} from '~/Constants';
import {AddFriendForm} from '~/components/channel/dm/AddFriendForm';
import {MobileFriendRequestItem} from '~/components/channel/friends/MobileFriendRequestItem';
import styles from '~/components/modals/AddFriendSheet.module.css';
import {BottomSheet} from '~/components/uikit/BottomSheet/BottomSheet';
import {Scroller} from '~/components/uikit/Scroller';
import RelationshipStore from '~/stores/RelationshipStore';

interface AddFriendSheetProps {
	isOpen: boolean;
	onClose: () => void;
}

export const AddFriendSheet: React.FC<AddFriendSheetProps> = observer(({isOpen, onClose}) => {
	const {t} = useLingui();
	const relationships = RelationshipStore.getRelationships();
	const incomingRequests = relationships.filter((relation) => relation.type === RelationshipTypes.INCOMING_REQUEST);
	const outgoingRequests = relationships.filter((relation) => relation.type === RelationshipTypes.OUTGOING_REQUEST);

	const hasPendingRequests = incomingRequests.length > 0 || outgoingRequests.length > 0;

	return (
		<BottomSheet
			isOpen={isOpen}
			onClose={onClose}
			snapPoints={[0, 1]}
			initialSnap={1}
			title={t`Add Friend`}
			disablePadding
		>
			<div className={styles.container}>
				<Scroller className={styles.scroller} key="add-friend-sheet-scroller">
					<div className={styles.content}>
						<AddFriendForm />

						{hasPendingRequests && (
							<div className={styles.requestsSection}>
								{incomingRequests.length > 0 && (
									<div className={styles.requestsGroup}>
										<div className={styles.requestsHeader}>
											{t`Incoming friend requests`} — {incomingRequests.length}
										</div>
										<div className={styles.requestsList}>
											{incomingRequests.map((request, index) => (
												<React.Fragment key={request.id}>
													<MobileFriendRequestItem
														userId={request.id}
														relationshipType={RelationshipTypes.INCOMING_REQUEST}
													/>
													{index < incomingRequests.length - 1 && <div className={styles.requestDivider} />}
												</React.Fragment>
											))}
										</div>
									</div>
								)}

								{outgoingRequests.length > 0 && (
									<div className={styles.requestsGroup}>
										<div className={styles.requestsHeader}>
											{t`Outgoing friend requests`} — {outgoingRequests.length}
										</div>
										<div className={styles.requestsList}>
											{outgoingRequests.map((request, index) => (
												<React.Fragment key={request.id}>
													<MobileFriendRequestItem
														userId={request.id}
														relationshipType={RelationshipTypes.OUTGOING_REQUEST}
													/>
													{index < outgoingRequests.length - 1 && <div className={styles.requestDivider} />}
												</React.Fragment>
											))}
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				</Scroller>
			</div>
		</BottomSheet>
	);
});
