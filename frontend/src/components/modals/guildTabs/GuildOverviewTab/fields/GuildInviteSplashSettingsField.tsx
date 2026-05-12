/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {EyeIcon} from '@phosphor-icons/react';
import clsx from 'clsx';
import type React from 'react';
import type {UseFormReturn} from 'react-hook-form';
import {GuildSplashCardAlignment} from '~/Constants';
import {Button} from '~/components/uikit/Button/Button';
import {CardAlignmentControls} from '~/components/uikit/CardAlignmentControls/CardAlignmentControls';
import type {FormInputs} from '~/utils/modals/guildTabs/GuildOverviewTabUtils';
import styles from '../GuildOverviewTab.module.css';

export const GuildInviteSplashSettingsField: React.FC<{
	form: UseFormReturn<FormInputs>;
	canManageGuild: boolean;
	onPreviewInvitePage?: () => void;
	onPreviewInviteModal?: () => void;
}> = ({form, canManageGuild, onPreviewInvitePage, onPreviewInviteModal}) => {
	const {t} = useLingui();
	const alignment = form.watch('splash_card_alignment', GuildSplashCardAlignment.CENTER);

	return (
		<div className={styles.splashSettingsContainer}>
			<div className={styles.splashSettingsRow}>
				<div className={styles.splashSettingsColumn}>
					<div className={styles.iconField}>
						<Trans>Preview</Trans>
					</div>
					<div className={styles.splashSettingsButtons}>
						{onPreviewInvitePage ? (
							<Button
								variant="secondary"
								small={true}
								onClick={onPreviewInvitePage}
								disabled={!canManageGuild}
								className={styles.invitePageButton}
							>
								<EyeIcon size={16} weight="bold" />
								<Trans>Invite Page</Trans>
							</Button>
						) : null}
						{onPreviewInviteModal ? (
							<Button variant="secondary" small={true} onClick={onPreviewInviteModal} disabled={!canManageGuild}>
								<EyeIcon size={16} weight="bold" />
								<Trans>Invite Modal</Trans>
							</Button>
						) : null}
					</div>
					<p className={styles.splashSettingsHelper}>
						<Trans>See how your invite looks to visitors.</Trans>
					</p>
				</div>

				<div className={clsx(styles.splashSettingsColumn, styles.splashSettingsColumnRight)}>
					<div className={styles.iconField}>
						<Trans>Card Alignment</Trans>
					</div>
					<div className={styles.alignmentControlsRow}>
						<CardAlignmentControls
							value={alignment}
							onChange={(value) => form.setValue('splash_card_alignment', value, {shouldDirty: true})}
							disabled={!canManageGuild}
							className={styles.cardAlignmentControls}
							disabledTooltipText={t`Alignment controls are only available on wider screens`}
						/>
					</div>
					<p className={styles.splashSettingsHelper}>
						<Trans>Only applies on wide screens.</Trans>
					</p>
				</div>
			</div>
		</div>
	);
};
