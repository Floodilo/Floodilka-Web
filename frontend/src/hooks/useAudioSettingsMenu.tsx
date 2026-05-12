/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type React from 'react';
import {useCallback} from 'react';
import * as ContextMenuActionCreators from '~/actions/ContextMenuActionCreators';
import {VoiceAudioSettingsMenu} from '~/components/voice/VoiceSettingsMenus';

interface UseAudioSettingsMenuOptions {
	inputDevices: Array<MediaDeviceInfo>;
	outputDevices: Array<MediaDeviceInfo>;
	isMobile?: boolean;
	onOpenMobile?: () => void;
}

interface UseAudioSettingsMenuResult {
	renderAudioSettingsMenu: (props: {onClose: () => void}) => React.ReactNode;
	handleAudioSettingsContextMenu: (event: React.MouseEvent) => void;
}

export const useAudioSettingsMenu = ({
	inputDevices,
	outputDevices,
	isMobile = false,
	onOpenMobile,
}: UseAudioSettingsMenuOptions): UseAudioSettingsMenuResult => {
	const renderAudioSettingsMenu = useCallback(
		({onClose}: {onClose: () => void}) => (
			<VoiceAudioSettingsMenu inputDevices={inputDevices} outputDevices={outputDevices} onClose={onClose} />
		),
		[inputDevices, outputDevices],
	);

	const handleAudioSettingsContextMenu = useCallback(
		(event: React.MouseEvent) => {
			if (isMobile) {
				event.preventDefault();
				event.stopPropagation();
				onOpenMobile?.();
				return;
			}

			ContextMenuActionCreators.openFromEvent(event, renderAudioSettingsMenu);
		},
		[isMobile, onOpenMobile, renderAudioSettingsMenu],
	);

	return {
		renderAudioSettingsMenu,
		handleAudioSettingsContextMenu,
	};
};
