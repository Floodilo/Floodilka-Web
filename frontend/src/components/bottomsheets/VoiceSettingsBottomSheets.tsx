/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {
	GearIcon,
	GridFourIcon,
	MicrophoneIcon,
	SpeakerHighIcon,
	SpeakerSlashIcon,
	UsersIcon,
	VideoIcon,
} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import * as VoiceCallLayoutActionCreators from '~/actions/VoiceCallLayoutActionCreators';
import * as VoiceSettingsActionCreators from '~/actions/VoiceSettingsActionCreators';
import * as VoiceStateActionCreators from '~/actions/VoiceStateActionCreators';
import {CameraPreviewModalInRoom} from '~/components/modals/CameraPreviewModal';
import {UserSettingsModal} from '~/components/modals/UserSettingsModal';
import type {MenuGroupType} from '~/components/uikit/MenuBottomSheet/MenuBottomSheet';
import {MenuBottomSheet} from '~/components/uikit/MenuBottomSheet/MenuBottomSheet';
import VoiceCallLayoutStore from '~/stores/VoiceCallLayoutStore';
import VoiceSettingsStore from '~/stores/VoiceSettingsStore';
import MediaEngineStore from '~/stores/voice/MediaEngineFacade';
import sharedStyles from './shared.module.css';

interface VoiceAudioSettingsBottomSheetProps {
	isOpen: boolean;
	onClose: () => void;
}

export const VoiceAudioSettingsBottomSheet: React.FC<VoiceAudioSettingsBottomSheetProps> = observer(
	({isOpen, onClose}) => {
		const {t} = useLingui();
		const voiceSettings = VoiceSettingsStore;
		const voiceState = MediaEngineStore.getCurrentUserVoiceState();
		const isDeafened = voiceState?.self_deaf ?? false;

		const handleToggleDeafen = () => {
			VoiceStateActionCreators.toggleSelfDeaf(null);
			onClose();
		};

		const handleOpenVoiceSettings = () => {
			onClose();
			ModalActionCreators.push(modal(() => <UserSettingsModal initialTab="voice_video" />));
		};

		const menuGroups: Array<MenuGroupType> = [];

		const deviceItems = [
			{
				icon: <MicrophoneIcon weight="fill" className={sharedStyles.icon} />,
				label: t`Input Device`,
				onClick: () => {
					onClose();
					ModalActionCreators.push(modal(() => <UserSettingsModal initialTab="voice_video" />));
				},
			},
			{
				icon: <SpeakerHighIcon weight="fill" className={sharedStyles.icon} />,
				label: t`Output Device`,
				onClick: () => {
					onClose();
					ModalActionCreators.push(modal(() => <UserSettingsModal initialTab="voice_video" />));
				},
			},
		];

		menuGroups.push({
			items: deviceItems,
		});

		const volumeItems = [
			{
				label: t`Input Volume`,
				value: voiceSettings.inputVolume,
				minValue: 0,
				maxValue: 100,
				onChange: (value: number) => {
					VoiceSettingsActionCreators.update({inputVolume: value});
				},
				onFormat: (value: number) => `${Math.round(value)}%`,
				factoryDefaultValue: 100,
			},
			{
				label: t`Output Volume`,
				value: voiceSettings.outputVolume,
				minValue: 0,
				maxValue: 100,
				onChange: (value: number) => {
					VoiceSettingsActionCreators.update({outputVolume: value});
				},
				onFormat: (value: number) => `${Math.round(value)}%`,
				factoryDefaultValue: 100,
			},
		];

		menuGroups.push({
			items: volumeItems,
		});

		menuGroups.push({
			items: [
				{
					icon: <SpeakerSlashIcon weight="fill" className={sharedStyles.icon} />,
					label: isDeafened ? t`Undeafen` : t`Deafen`,
					onClick: handleToggleDeafen,
				},
			],
		});

		menuGroups.push({
			items: [
				{
					icon: <GearIcon weight="fill" className={sharedStyles.icon} />,
					label: t`Voice Settings`,
					onClick: handleOpenVoiceSettings,
				},
			],
		});

		return <MenuBottomSheet isOpen={isOpen} onClose={onClose} groups={menuGroups} />;
	},
);

interface VoiceCameraSettingsBottomSheetProps {
	isOpen: boolean;
	onClose: () => void;
}

export const VoiceCameraSettingsBottomSheet: React.FC<VoiceCameraSettingsBottomSheetProps> = observer(
	({isOpen, onClose}) => {
		const {t} = useLingui();

		const handlePreviewCamera = () => {
			onClose();
			ModalActionCreators.push(modal(() => <CameraPreviewModalInRoom />));
		};

		const handleOpenVideoSettings = () => {
			onClose();
			ModalActionCreators.push(modal(() => <UserSettingsModal initialTab="voice_video" />));
		};

		const menuGroups: Array<MenuGroupType> = [];

		const cameraItems = [
			{
				icon: <VideoIcon weight="fill" className={sharedStyles.icon} />,
				label: t`Camera Device`,
				onClick: () => {
					onClose();
					ModalActionCreators.push(modal(() => <UserSettingsModal initialTab="voice_video" />));
				},
			},
		];

		menuGroups.push({
			items: cameraItems,
		});

		const cameraActions = [
			{
				icon: <VideoIcon weight="fill" className={sharedStyles.icon} />,
				label: t`Preview Camera`,
				onClick: handlePreviewCamera,
			},
		];

		menuGroups.push({
			items: cameraActions,
		});

		menuGroups.push({
			items: [
				{
					icon: <GearIcon weight="fill" className={sharedStyles.icon} />,
					label: t`Video Settings`,
					onClick: handleOpenVideoSettings,
				},
			],
		});

		return <MenuBottomSheet isOpen={isOpen} onClose={onClose} groups={menuGroups} />;
	},
);

interface VoiceMoreOptionsBottomSheetProps {
	isOpen: boolean;
	onClose: () => void;
}

export const VoiceMoreOptionsBottomSheet: React.FC<VoiceMoreOptionsBottomSheetProps> = observer(({isOpen, onClose}) => {
	const {t} = useLingui();
	const voiceSettings = VoiceSettingsStore;
	const layoutMode = VoiceCallLayoutStore.layoutMode;
	const isGrid = layoutMode === 'grid';

	const handleToggleGrid = () => {
		if (isGrid) VoiceCallLayoutActionCreators.setLayoutMode('focus');
		else VoiceCallLayoutActionCreators.setLayoutMode('grid');
	};

	const menuGroups: Array<MenuGroupType> = [];

	const displayItems = [
		{
			icon: <GridFourIcon weight="fill" className={sharedStyles.icon} />,
			label: t`Grid View`,
			onClick: () => {
				handleToggleGrid();
				onClose();
			},
		},
		{
			icon: <UsersIcon weight="fill" className={sharedStyles.icon} />,
			label: t`Show My Own Camera`,
			onClick: () => {
				VoiceSettingsActionCreators.update({showMyOwnCamera: !voiceSettings.showMyOwnCamera});
			},
		},
		{
			icon: <UsersIcon weight="fill" className={sharedStyles.icon} />,
			label: t`Show Non-Video Participants`,
			onClick: () => {
				VoiceSettingsActionCreators.update({showNonVideoParticipants: !voiceSettings.showNonVideoParticipants});
			},
		},
	];

	menuGroups.push({
		items: displayItems,
	});

	menuGroups.push({
		items: [
			{
				icon: <GearIcon weight="fill" className={sharedStyles.icon} />,
				label: t`Voice & Video Settings`,
				onClick: () => {
					onClose();
					ModalActionCreators.push(modal(() => <UserSettingsModal initialTab="voice_video" />));
				},
			},
		],
	});

	return <MenuBottomSheet isOpen={isOpen} onClose={onClose} groups={menuGroups} />;
});
