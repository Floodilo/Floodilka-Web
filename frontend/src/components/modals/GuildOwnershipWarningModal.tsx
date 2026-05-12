/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import * as Modal from '~/components/modals/Modal';
import {GuildIcon} from '~/components/popouts/GuildIcon';
import {Button} from '~/components/uikit/Button/Button';
import type {GuildRecord} from '~/records/GuildRecord';
import styles from './GuildOwnershipWarningModal.module.css';

interface GuildOwnershipWarningModalProps {
	ownedGuilds: Array<GuildRecord>;
	action: 'disable' | 'delete';
}

export const GuildOwnershipWarningModal: React.FC<GuildOwnershipWarningModalProps> = observer(
	({ownedGuilds, action}) => {
		const {t} = useLingui();
		const displayedGuilds = ownedGuilds.slice(0, 3);
		const remainingCount = ownedGuilds.length - 3;

		return (
			<Modal.Root size="small" centered>
				<Modal.Header title={action === 'disable' ? t`Cannot Disable Account` : t`Cannot Delete Account`} />
				<Modal.Content>
					<div className={styles.content}>
						<p>
							{action === 'disable' ? (
								<Trans>
									You cannot disable your account while you own communities. Please transfer ownership of the following
									communities first:
								</Trans>
							) : (
								<Trans>
									You cannot delete your account while you own communities. Please transfer ownership of the following
									communities first:
								</Trans>
							)}
						</p>
						<div className={styles.guildList}>
							{displayedGuilds.map((guild) => (
								<div key={guild.id} className={styles.guildItem}>
									<GuildIcon
										id={guild.id}
										name={guild.name}
										icon={guild.icon}
										className={styles.guildIcon}
										sizePx={40}
									/>
									<div className={styles.guildInfo}>
										<div className={styles.guildName}>{guild.name}</div>
									</div>
								</div>
							))}
							{remainingCount > 0 && (
								<div className={styles.remainingCount}>
									<Trans>and {remainingCount} more</Trans>
								</div>
							)}
						</div>
						<p className={styles.helpText}>
							<Trans>
								To transfer ownership, go to Community Settings → Overview and use the Transfer Ownership option.
							</Trans>
						</p>
					</div>
				</Modal.Content>
				<Modal.Footer>
					<Button onClick={ModalActionCreators.pop}>
						<Trans>OK</Trans>
					</Button>
				</Modal.Footer>
			</Modal.Root>
		);
	},
);
