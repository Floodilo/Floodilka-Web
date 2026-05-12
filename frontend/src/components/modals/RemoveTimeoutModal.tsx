/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as GuildMemberActionCreators from '~/actions/GuildMemberActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import type {UserRecord} from '~/records/UserRecord';

interface RemoveTimeoutModalProps {
	guildId: string;
	targetUser: UserRecord;
}

export const RemoveTimeoutModal: React.FC<RemoveTimeoutModalProps> = observer(({guildId, targetUser}) => {
	const {t} = useLingui();
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const handleRemove = async () => {
		setIsSubmitting(true);
		try {
			await GuildMemberActionCreators.timeout(guildId, targetUser.id, null);
			ToastActionCreators.createToast({
				type: 'success',
				children: <Trans>Successfully removed timeout from {targetUser.tag}</Trans>,
			});
			ModalActionCreators.pop();
		} catch (error) {
			console.error('Failed to remove timeout:', error);
			ToastActionCreators.createToast({
				type: 'error',
				children: <Trans>Failed to remove timeout. Please try again.</Trans>,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Modal.Root size="small" centered>
			<Modal.Header title={t`Remove Timeout`} />
			<Modal.Content>
				<p style={{margin: 0}}>
					<Trans>
						Removing the timeout will allow <strong>{targetUser.tag}</strong> to send messages, react, and join voice
						channels again.
					</Trans>
				</p>
			</Modal.Content>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => ModalActionCreators.pop()} disabled={isSubmitting}>
					<Trans>Cancel</Trans>
				</Button>
				<Button variant="danger-primary" onClick={handleRemove} disabled={isSubmitting}>
					<Trans>Remove Timeout</Trans>
				</Button>
			</Modal.Footer>
		</Modal.Root>
	);
});
