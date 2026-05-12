/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as GuildActionCreators from '~/actions/GuildActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {ConfirmModal} from '~/components/modals/ConfirmModal';
import {Button} from '~/components/uikit/Button/Button';
import GuildStore from '~/stores/GuildStore';
import UserStore from '~/stores/UserStore';
import styles from './DisableInvitesButton.module.css';

export const DisableInvitesButton: React.FC<{guildId: string}> = observer(function DisableInvitesButton({guildId}) {
	const {t} = useLingui();
	const guild = GuildStore.getGuild(guildId);
	const currentUser = UserStore.currentUser;
	const invitesDisabled = guild?.features.has('INVITES_DISABLED') ?? false;

	const isOwner = guild?.ownerId === currentUser?.id;
	const isUnclaimed = currentUser != null && !currentUser.isClaimed();
	const isPreviewGuild = isOwner && isUnclaimed;

	const handleToggleInvites = React.useCallback(() => {
		ModalActionCreators.push(
			modal(() => (
				<ConfirmModal
					title={invitesDisabled ? t`Enable invites for this community` : t`Disable invites for this community`}
					description={
						invitesDisabled ? (
							<Trans>
								Are you sure you want to enable invites? This will allow users to join this community through invite
								links again.
							</Trans>
						) : (
							<Trans>
								Are you sure you want to disable invites? This will prevent new users from joining through invite links
								until you re-enable them. Existing members will not be affected.
							</Trans>
						)
					}
					primaryText={invitesDisabled ? t`Enable` : t`Disable`}
					primaryVariant={invitesDisabled ? 'primary' : 'danger-primary'}
					secondaryText={t`Cancel`}
					onPrimary={async () => {
						await GuildActionCreators.toggleInvitesDisabled(guildId, !invitesDisabled);
					}}
				/>
			)),
		);
	}, [guildId, invitesDisabled]);

	if (isPreviewGuild) {
		return (
			<div className={styles.container}>
				<Button variant="secondary" small={true} disabled={true}>
					<Trans>Invites Locked</Trans>
				</Button>
				<p className={styles.message}>
					<Trans>
						Invites are locked for preview communities. Claim your account by setting an email and password to enable
						invites.
					</Trans>
				</p>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<Button variant={invitesDisabled ? 'danger-primary' : 'secondary'} small={true} onClick={handleToggleInvites}>
				{invitesDisabled ? <Trans>Enable Invites</Trans> : <Trans>Pause Invites</Trans>}
			</Button>
			{invitesDisabled && (
				<p className={styles.message}>
					<Trans>Invites are currently disabled for this community.</Trans>
				</p>
			)}
		</div>
	);
});
