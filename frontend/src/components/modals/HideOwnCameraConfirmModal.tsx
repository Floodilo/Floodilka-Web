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
import * as VoiceSettingsActionCreators from '~/actions/VoiceSettingsActionCreators';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import {Checkbox} from '~/components/uikit/Checkbox/Checkbox';
import VoicePromptsStore from '~/stores/VoicePromptsStore';
import styles from './HideOwnCameraConfirmModal.module.css';

export const HideOwnCameraConfirmModal: React.FC = observer(() => {
	const {t} = useLingui();
	const [dontAskAgain, setDontAskAgain] = React.useState(false);
	const initialFocusRef = React.useRef<HTMLButtonElement | null>(null);

	const handleConfirm = () => {
		if (dontAskAgain) VoicePromptsStore.setSkipHideOwnCameraConfirm(true);
		VoiceSettingsActionCreators.update({showMyOwnCamera: false});
		ModalActionCreators.pop();
	};

	const handleCancel = () => {
		ModalActionCreators.pop();
	};

	return (
		<Modal.Root size="small" centered initialFocusRef={initialFocusRef}>
			<Modal.Header title={<Trans>Hide your own camera?</Trans>} />
			<Modal.Content>
				<p className={styles.description}>
					<Trans>
						Turning this off only hides your camera from your own view. Others in the call can still see your camera
						feed.
					</Trans>
				</p>
				<div className={styles.checkboxContainer}>
					<Checkbox checked={dontAskAgain} onChange={(checked) => setDontAskAgain(checked)} size="small">
						<span className={styles.checkboxLabel}>
							<Trans>Don't ask me again</Trans>
						</span>
					</Checkbox>
				</div>
			</Modal.Content>
			<Modal.Footer>
				<Button variant="secondary" onClick={handleCancel}>{t`Cancel`}</Button>
				<Button variant="primary" onClick={handleConfirm} ref={initialFocusRef}>{t`Hide`}</Button>
			</Modal.Footer>
		</Modal.Root>
	);
});
