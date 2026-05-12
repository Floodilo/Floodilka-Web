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
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import type {GuildMemberRecord} from '~/records/GuildMemberRecord';
import type {UserRecord} from '~/records/UserRecord';
import {isAbortError} from '~/stores/SudoPromptStore';
import styles from './TransferOwnershipModal.module.css';

export const TransferOwnershipModal: React.FC<{
	guildId: string;
	targetUser: UserRecord;
	targetMember: GuildMemberRecord;
}> = observer(({guildId, targetUser}) => {
	const {t} = useLingui();
	const [isTransferring, setIsTransferring] = React.useState(false);

	const handleTransfer = async () => {
		setIsTransferring(true);
		try {
			await GuildActionCreators.transferOwnership(guildId, targetUser.id);
			ToastActionCreators.createToast({
				type: 'success',
				children: <Trans>Successfully transferred ownership to {targetUser.username}</Trans>,
			});
			ModalActionCreators.pop();
		} catch (error) {
			if (isAbortError(error)) {
				return;
			}
			console.error('Failed to transfer ownership:', error);
			ToastActionCreators.createToast({
				type: 'error',
				children: <Trans>Failed to transfer ownership. Please try again.</Trans>,
			});
		} finally {
			setIsTransferring(false);
		}
	};

	return (
		<Modal.Root size="small" centered>
			<Modal.Header title={t`Transfer Community Ownership`} />
			<Modal.Content>
				<div className={styles.content}>
					<div className={styles.warningBox}>
						<p className={styles.warningText}>
							<Trans>
								You are about to transfer ownership of this community to <strong>{targetUser.username}</strong>. This
								action is <strong>irreversible</strong> and you will lose all owner privileges.
							</Trans>
						</p>
					</div>
				</div>
			</Modal.Content>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => ModalActionCreators.pop()} disabled={isTransferring}>
					<Trans>Cancel</Trans>
				</Button>
				<Button variant="danger-primary" onClick={handleTransfer} disabled={isTransferring}>
					<Trans>Transfer Ownership</Trans>
				</Button>
			</Modal.Footer>
		</Modal.Root>
	);
});
