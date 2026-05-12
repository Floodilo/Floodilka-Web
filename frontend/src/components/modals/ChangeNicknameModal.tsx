/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import * as GuildMemberActionCreators from '~/actions/GuildMemberActionCreators';
import {BaseChangeNicknameModal} from '~/components/modals/BaseChangeNicknameModal';
import type {GuildMemberRecord} from '~/records/GuildMemberRecord';
import type {UserRecord} from '~/records/UserRecord';
import AuthenticationStore from '~/stores/AuthenticationStore';

interface ChangeNicknameModalProps {
	guildId: string;
	user: UserRecord;
	member: GuildMemberRecord;
}

export const ChangeNicknameModal: React.FC<ChangeNicknameModalProps> = observer(({guildId, user, member}) => {
	const currentUserId = AuthenticationStore.currentUserId;
	const isCurrentUser = user.id === currentUserId;

	const handleSave = React.useCallback(
		async (nick: string | null) => {
			if (isCurrentUser) {
				await GuildMemberActionCreators.updateProfile(guildId, {nick});
			} else {
				await GuildMemberActionCreators.update(guildId, user.id, {nick});
			}
		},
		[guildId, user.id, isCurrentUser],
	);

	return <BaseChangeNicknameModal currentNick={member.nick || ''} displayName={user.displayName} onSave={handleSave} />;
});
