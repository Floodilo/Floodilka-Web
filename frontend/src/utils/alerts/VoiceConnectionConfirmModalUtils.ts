/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';

export interface VoiceConnectionConfirmModalCallbacks {
	onSwitchDevice: () => void;
	onCancel: () => void;
}

export interface VoiceConnectionConfirmModalProps extends VoiceConnectionConfirmModalCallbacks {
	guildId: string | null;
	channelId: string;
}

export interface VoiceConnectionConfirmModalLogicState {
	handleSwitchDevice: () => Promise<void>;
	handleCancel: () => void;
}

export const useVoiceConnectionConfirmModalLogic = ({
	onSwitchDevice,
	onCancel,
}: VoiceConnectionConfirmModalCallbacks): VoiceConnectionConfirmModalLogicState => {
	const handleSwitchDevice = React.useCallback(async () => {
		onSwitchDevice();
		ModalActionCreators.pop();
	}, [onSwitchDevice]);

	const handleCancel = React.useCallback(() => {
		onCancel();
		ModalActionCreators.pop();
	}, [onCancel]);

	return {
		handleSwitchDevice,
		handleCancel,
	};
};
