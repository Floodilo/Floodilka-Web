/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {GuildFeatures} from '~/Constants';
import {PreviewGuildInviteHeader} from '~/components/auth/InviteHeader';
import styles from '~/components/modals/InviteAcceptModal.module.css';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import foodPatternUrl from '~/images/i-like-food.svg';
import type {GuildRecord} from '~/records/GuildRecord';
import GuildMemberStore from '~/stores/GuildMemberStore';
import PresenceStore from '~/stores/PresenceStore';
import * as AvatarUtils from '~/utils/AvatarUtils';

interface InviteAcceptModalPreviewProps {
	guild: GuildRecord;
	previewName: string | null | undefined;
	previewIconUrl: string | null;
	hasClearedIcon: boolean;
	previewSplashUrl: string | null;
	hasClearedSplash: boolean;
}

export const InviteAcceptModalPreview = observer(function InviteAcceptModalPreview({
	guild,
	previewName,
	previewIconUrl,
	hasClearedIcon,
	previewSplashUrl,
	hasClearedSplash,
}: InviteAcceptModalPreviewProps) {
	const {t} = useLingui();
	const handleDismiss = React.useCallback(() => {
		ModalActionCreators.pop();
	}, []);

	const presenceCount = PresenceStore.getPresenceCount(guild.id);
	const memberCount = GuildMemberStore.getMemberCount(guild.id);

	const guildFeatures = React.useMemo(() => {
		return Array.from(guild.features);
	}, [guild.features]);

	const isVerified = guildFeatures.includes(GuildFeatures.VERIFIED);

	const splashUrl = React.useMemo(() => {
		if (hasClearedSplash) {
			return null;
		}

		if (previewSplashUrl) {
			return previewSplashUrl;
		}

		if (guild.splash) {
			return AvatarUtils.getGuildSplashURL({
				id: guild.id,
				splash: guild.splash,
			});
		}

		return null;
	}, [guild.id, guild.splash, hasClearedSplash, previewSplashUrl]);

	return (
		<Modal.Root size="large" className={styles.root} centered onClose={handleDismiss}>
			<Modal.ScreenReaderLabel text={t`Invite modal preview`} />
			<Modal.InsetCloseButton onClick={handleDismiss} disabled={false} />

			<div className={styles.background} aria-hidden>
				{splashUrl ? (
					<div className={styles.splashImage} style={{backgroundImage: `url(${splashUrl})`}} />
				) : (
					<div className={styles.patternImage} style={{backgroundImage: `url(${foodPatternUrl})`}} />
				)}
			</div>

			<div className={styles.cardHost}>
				<div className={styles.card}>
					<div className={styles.cardInner}>
						<PreviewGuildInviteHeader
							guildId={guild.id}
							guildName={guild.name}
							guildIcon={guild.icon}
							isVerified={isVerified}
							presenceCount={presenceCount}
							memberCount={memberCount}
							previewIconUrl={hasClearedIcon ? null : previewIconUrl}
							previewName={previewName}
						/>

						<div className={styles.actions}>
							<Button disabled={true}>
								<Trans>Join Community</Trans>
							</Button>
						</div>
					</div>
				</div>
			</div>
		</Modal.Root>
	);
});
