/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as InviteActionCreators from '~/actions/InviteActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {Nagbar} from '~/components/layout/Nagbar';
import {NagbarButton} from '~/components/layout/NagbarButton';
import {NagbarContent} from '~/components/layout/NagbarContent';
import {InviteAcceptModal} from '~/components/modals/InviteAcceptModal';
import AuthenticationStore from '~/stores/AuthenticationStore';
import GuildMemberStore from '~/stores/GuildMemberStore';
import GuildStore from '~/stores/GuildStore';
import InviteStore from '~/stores/InviteStore';
import NagbarStore from '~/stores/NagbarStore';
import {isGuildInvite} from '~/types/InviteTypes';

const FLOODILKA_HQ_INVITE_CODE = 'floodilka';

export const GuildMembershipCtaNagbar = observer(({isMobile}: {isMobile: boolean}) => {
	const currentUserId = AuthenticationStore.currentUserId;
	const inviteState = InviteStore.invites.get(FLOODILKA_HQ_INVITE_CODE);
	const invite = inviteState?.data ?? null;

	const [isSubmitting, setIsSubmitting] = React.useState(false);

	React.useEffect(() => {
		const hqGuild = GuildStore.getGuilds().find((guild) => guild.vanityURLCode === FLOODILKA_HQ_INVITE_CODE);
		if (hqGuild && GuildMemberStore.getMember(hqGuild.id, currentUserId ?? '')) {
			NagbarStore.guildMembershipCtaDismissed = true;
		}
	}, [currentUserId]);

	if (!currentUserId) {
		return null;
	}

	if (invite && isGuildInvite(invite)) {
		const guildId = invite.guild.id;
		const isMember = Boolean(GuildMemberStore.getMember(guildId, currentUserId));
		if (isMember) {
			return null;
		}
	}

	const handleJoinGuild = async () => {
		if (isSubmitting) return;

		setIsSubmitting(true);
		try {
			await InviteActionCreators.fetchWithCoalescing(FLOODILKA_HQ_INVITE_CODE);
		} finally {
			setIsSubmitting(false);
			ModalActionCreators.push(modal(() => <InviteAcceptModal code={FLOODILKA_HQ_INVITE_CODE} />));
		}
	};

	const handleDismiss = () => {
		NagbarStore.guildMembershipCtaDismissed = true;
	};

	return (
		<Nagbar
			isMobile={isMobile}
			backgroundColor="var(--brand-primary)"
			textColor="var(--text-on-brand-primary)"
			onDismiss={handleDismiss}
			dismissible={true}
		>
			<NagbarContent
				isMobile={isMobile}
				message={<Trans>Join the Floodilka community to chat with the team and stay up to date on the latest!</Trans>}
				actions={
					<NagbarButton isMobile={isMobile} onClick={handleJoinGuild} submitting={isSubmitting} disabled={isSubmitting}>
						<Trans>Join</Trans>
					</NagbarButton>
				}
			/>
		</Nagbar>
	);
});
