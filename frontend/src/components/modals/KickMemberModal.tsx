/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import * as GuildMemberActionCreators from '~/actions/GuildMemberActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {ConfirmModal} from '~/components/modals/ConfirmModal';
import type {UserRecord} from '~/records/UserRecord';

export const KickMemberModal: React.FC<{guildId: string; targetUser: UserRecord}> = observer(
	({guildId, targetUser}) => {
		const {t} = useLingui();
		const handleKick = async () => {
			try {
				await GuildMemberActionCreators.kick(guildId, targetUser.id);
				ToastActionCreators.createToast({
					type: 'success',
					children: <Trans>Successfully kicked {targetUser.tag} from the community</Trans>,
				});
			} catch (error) {
				console.error('Failed to kick member:', error);
				ToastActionCreators.createToast({
					type: 'error',
					children: <Trans>Failed to kick member. Please try again.</Trans>,
				});
			}
		};

		return (
			<ConfirmModal
				title={t`Kick Member`}
				description={
					<div>
						<Trans>
							Are you sure you want to kick <strong>{targetUser.tag}</strong> from the community? They will be able to
							rejoin with a new invite.
						</Trans>
					</div>
				}
				primaryText={t`Kick`}
				primaryVariant="danger-primary"
				secondaryText={t`Cancel`}
				onPrimary={handleKick}
			/>
		);
	},
);
