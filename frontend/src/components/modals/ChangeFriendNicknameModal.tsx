/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import * as RelationshipActionCreators from '~/actions/RelationshipActionCreators';
import {BaseChangeNicknameModal} from '~/components/modals/BaseChangeNicknameModal';
import type {UserRecord} from '~/records/UserRecord';
import RelationshipStore from '~/stores/RelationshipStore';

interface ChangeFriendNicknameModalProps {
	user: UserRecord;
}

export const ChangeFriendNicknameModal: React.FC<ChangeFriendNicknameModalProps> = observer(({user}) => {
	const relationship = RelationshipStore.getRelationship(user.id);
	const currentNick = relationship?.nickname ?? '';

	const handleSave = React.useCallback(
		async (nick: string | null) => {
			await RelationshipActionCreators.updateFriendNickname(user.id, nick);
		},
		[user.id],
	);

	return <BaseChangeNicknameModal currentNick={currentNick} displayName={user.displayName} onSave={handleSave} />;
});
