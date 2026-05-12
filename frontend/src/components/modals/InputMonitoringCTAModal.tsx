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
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import KeybindManager from '~/lib/KeybindManager';
import InputMonitoringPromptsStore from '~/stores/InputMonitoringPromptsStore';
import {openNativePermissionSettings, requestNativePermission} from '~/utils/NativePermissions';
import {Button} from '../uikit/Button/Button';
import styles from './ConfirmModal.module.css';
import * as Modal from './Modal';

interface InputMonitoringCTAModalProps {
	onComplete?: () => void;
}

export const InputMonitoringCTAModal: React.FC<InputMonitoringCTAModalProps> = observer(({onComplete}) => {
	const {t} = useLingui();
	const [submitting, setSubmitting] = React.useState(false);
	const initialFocusRef = React.useRef<HTMLButtonElement | null>(null);

	const handleEnable = async () => {
		setSubmitting(true);
		try {
			const result = await requestNativePermission('input-monitoring');

			if (result === 'granted') {
				ToastActionCreators.createToast({type: 'success', children: t`Input Monitoring enabled`});
				await KeybindManager.reapplyGlobalShortcuts();
			} else if (result === 'denied') {
				await openNativePermissionSettings('input-monitoring');
				ToastActionCreators.createToast({
					type: 'info',
					children: t`Please enable Флудилка in System Settings → Privacy & Security → Input Monitoring.`,
				});
			}

			InputMonitoringPromptsStore.dismissInputMonitoringCTA();
			ModalActionCreators.pop();
			onComplete?.();
		} finally {
			setSubmitting(false);
		}
	};

	const handleDismiss = () => {
		InputMonitoringPromptsStore.dismissInputMonitoringCTA();
		ModalActionCreators.pop();
		onComplete?.();
	};

	return (
		<Modal.Root size="small" centered initialFocusRef={initialFocusRef}>
			<Modal.Header title={t`Enable Input Monitoring`} />
			<Modal.Content className={styles.content}>
				<p>
					<Trans>
						Флудилка needs permission to monitor keyboard and mouse input so that <strong>Push-to-Talk</strong> and{' '}
						<strong>Global Shortcuts</strong> work even when you're in another app or game.
					</Trans>
				</p>
				<p style={{marginTop: '12px'}}>
					<Trans>
						This is required to detect any key or mouse button you choose for Push-to-Talk. You can change this later in{' '}
						<strong>System Settings → Privacy & Security → Input Monitoring</strong>.
					</Trans>
				</p>
			</Modal.Content>
			<Modal.Footer>
				<Button onClick={handleDismiss} variant="secondary">
					<Trans>Not Now</Trans>
				</Button>
				<Button onClick={handleEnable} submitting={submitting} variant="primary" ref={initialFocusRef}>
					<Trans>Enable Input Monitoring</Trans>
				</Button>
			</Modal.Footer>
		</Modal.Root>
	);
});
