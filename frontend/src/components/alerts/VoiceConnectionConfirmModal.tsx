/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import {
	useVoiceConnectionConfirmModalLogic,
	type VoiceConnectionConfirmModalProps,
} from '~/utils/alerts/VoiceConnectionConfirmModalUtils';
import styles from './VoiceConnectionConfirmModal.module.css';

export const VoiceConnectionConfirmModal: React.FC<VoiceConnectionConfirmModalProps> = observer(
	({guildId: _guildId, channelId: _channelId, onSwitchDevice, onCancel}) => {
		const {t} = useLingui();
		const {handleSwitchDevice} = useVoiceConnectionConfirmModalLogic({
			onSwitchDevice,
			onCancel,
		});

		return (
			<Modal.Root size="small" centered>
				<Modal.Header title={t`Voice Connection Confirmation`} />
				<Modal.Content>
					<Trans>You're already connected to this voice channel from another device.</Trans>
				</Modal.Content>
				<Modal.Footer>
					<div className={styles.footer}>
						<Button variant="primary" onClick={handleSwitchDevice} className={styles.fullWidth}>
							<Trans>Switch to This Device</Trans>
						</Button>
					</div>
				</Modal.Footer>
			</Modal.Root>
		);
	},
);
