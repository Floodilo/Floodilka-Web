/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {UserPlusIcon, WarningCircleIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as GuildActionCreators from '~/actions/GuildActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {Permissions} from '~/Constants';
import {InvitesLoadFailedModal} from '~/components/alerts/InvitesLoadFailedModal';
import {DisableInvitesButton} from '~/components/invites/DisableInvitesButton';
import {InviteDateToggle} from '~/components/invites/InviteDateToggle';
import {InviteListHeader, InviteListItem} from '~/components/invites/InviteListItem';
import {StatusSlate} from '~/components/modals/shared/StatusSlate';
import {Spinner} from '~/components/uikit/Spinner';
import {useInviteRevoke} from '~/hooks/useInviteRevoke';
import InviteStore from '~/stores/InviteStore';
import PermissionStore from '~/stores/PermissionStore';
import styles from './GuildInvitesTab.module.css';

const GuildInvitesTab: React.FC<{guildId: string}> = observer(({guildId}) => {
	const invites = InviteStore.guildInvites.get(guildId) ?? null;
	const fetchStatus = InviteStore.guildInvitesFetchStatus.get(guildId) ?? 'idle';
	const handleRevoke = useInviteRevoke();
	const [showCreatedDate, setShowCreatedDate] = React.useState(false);

	const fetchInvites = React.useCallback(async () => {
		try {
			await GuildActionCreators.fetchGuildInvites(guildId);
		} catch (_error) {
			ModalActionCreators.push(modal(() => <InvitesLoadFailedModal />));
		}
	}, [guildId]);

	const canManageGuild = PermissionStore.can(Permissions.MANAGE_GUILD, {
		guildId,
	});

	React.useEffect(() => {
		if (fetchStatus === 'idle') {
			void fetchInvites();
		}
	}, [fetchStatus, fetchInvites]);

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h2 className={styles.title}>
					<Trans>Invite Links</Trans>
				</h2>
				<p className={styles.subtitle}>
					<Trans>
						View all invites for this community. To create a new invite, go to a channel and use the invite button.
					</Trans>
				</p>
			</div>

			{canManageGuild && <DisableInvitesButton guildId={guildId} />}

			{fetchStatus === 'pending' && (
				<div className={styles.spinnerContainer}>
					<Spinner />
				</div>
			)}

			{fetchStatus === 'success' && invites && invites.length > 0 && (
				<div className={styles.invitesContainer}>
					<InviteDateToggle showCreatedDate={showCreatedDate} onToggle={setShowCreatedDate} />
					<div className={styles.inviteList}>
						<InviteListHeader showChannel={true} showCreatedDate={showCreatedDate} />
						<div className={styles.inviteItems}>
							{invites.map((invite) => (
								<InviteListItem
									key={invite.code}
									invite={invite}
									onRevoke={handleRevoke}
									showChannel={true}
									showCreatedDate={showCreatedDate}
								/>
							))}
						</div>
					</div>
				</div>
			)}

			{fetchStatus === 'success' && invites && invites.length === 0 && (
				<StatusSlate
					Icon={UserPlusIcon}
					title={<Trans>No invite links</Trans>}
					description={
						<Trans>
							This community doesn't have any invite links yet. Go to a channel and create an invite to invite people.
						</Trans>
					}
					fullHeight={true}
				/>
			)}

			{fetchStatus === 'error' && (
				<StatusSlate
					Icon={WarningCircleIcon}
					title={<Trans>Failed to load invites</Trans>}
					description={<Trans>There was an error loading the invites. Please try again.</Trans>}
					actions={[
						{
							text: <Trans>Retry</Trans>,
							onClick: fetchInvites,
							variant: 'primary',
						},
					]}
					fullHeight={true}
				/>
			)}
		</div>
	);
});

export default GuildInvitesTab;
