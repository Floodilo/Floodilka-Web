/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {AccountDeleteModal} from '~/components/modals/AccountDeleteModal';
import {AccountDisableModal} from '~/components/modals/AccountDisableModal';
import {GuildOwnershipWarningModal} from '~/components/modals/GuildOwnershipWarningModal';
import {SettingsTabSection} from '~/components/modals/shared/SettingsTabLayout';
import {Button} from '~/components/uikit/Button/Button';
import type {UserRecord} from '~/records/UserRecord';
import GuildStore from '~/stores/GuildStore';
import styles from './AccountTab.module.css';

interface DangerZoneTabProps {
	user: UserRecord;
	isClaimed: boolean;
}

export const DangerZoneTabContent: React.FC<DangerZoneTabProps> = observer(({user, isClaimed}) => {
	const handleDisableAccount = () => {
		const ownedGuilds = GuildStore.getOwnedGuilds(user.id);
		if (ownedGuilds.length > 0) {
			ModalActionCreators.push(modal(() => <GuildOwnershipWarningModal ownedGuilds={ownedGuilds} action="disable" />));
		} else {
			ModalActionCreators.push(modal(() => <AccountDisableModal />));
		}
	};

	const handleDeleteAccount = () => {
		const ownedGuilds = GuildStore.getOwnedGuilds(user.id);
		if (ownedGuilds.length > 0) {
			ModalActionCreators.push(modal(() => <GuildOwnershipWarningModal ownedGuilds={ownedGuilds} action="delete" />));
		} else {
			ModalActionCreators.push(modal(() => <AccountDeleteModal />));
		}
	};

	return (
		<>
			{isClaimed && (
				<SettingsTabSection>
					<div className={styles.row}>
						<div className={styles.rowContent}>
							<div className={styles.label}>
								<Trans>Disable Account</Trans>
							</div>
							<div className={styles.description}>
								<Trans>Temporarily disable your account. You can reactivate it later by signing back in.</Trans>
							</div>
						</div>
						<Button variant="danger-secondary" small={true} onClick={handleDisableAccount}>
							<Trans>Disable Account</Trans>
						</Button>
					</div>
				</SettingsTabSection>
			)}

			<SettingsTabSection>
				<div className={styles.row}>
					<div className={styles.rowContent}>
						<div className={styles.label}>
							<Trans>Delete Account</Trans>
						</div>
						<div className={styles.description}>
							<Trans>Permanently delete your account and all associated data. This action cannot be undone.</Trans>
						</div>
					</div>
					<Button variant="danger-primary" small={true} onClick={handleDeleteAccount}>
						<Trans>Delete Account</Trans>
					</Button>
				</div>
			</SettingsTabSection>
		</>
	);
});
