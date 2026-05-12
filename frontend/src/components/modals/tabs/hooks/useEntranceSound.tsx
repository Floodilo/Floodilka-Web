/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import React from 'react';
import * as PremiumModalActionCreators from '~/actions/PremiumModalActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import * as CustomSoundDB from '~/utils/CustomSoundDB';
import {openFilePicker} from '~/utils/FilePickerUtils';

export const useEntranceSound = (hasPremium: boolean) => {
	const {t} = useLingui();
	const [entranceSound, setEntranceSound] = React.useState<CustomSoundDB.EntranceSound | null>(null);
	const [isPreviewing, setIsPreviewing] = React.useState(false);

	React.useEffect(() => {
		const loadEntranceSound = async () => {
			try {
				const sound = await CustomSoundDB.getEntranceSound();
				setEntranceSound(sound);
			} catch (error) {
				console.error('Failed to load entrance sound:', error);
			}
		};
		loadEntranceSound();
	}, []);

	const upload = React.useCallback(
		async (file: File | null) => {
			if (!hasPremium || !file) {
				return;
			}

			const validation = CustomSoundDB.isValidAudioFile(file);
			if (!validation.valid) {
				ToastActionCreators.createToast({
					type: 'error',
					children: validation.error || t`Invalid audio file`,
				});
				return;
			}

			const durationValidation = await CustomSoundDB.validateAudioDuration(file);
			if (!durationValidation.valid) {
				ToastActionCreators.createToast({
					type: 'error',
					children: durationValidation.error || t`Audio is too long`,
				});
				return;
			}

			try {
				await CustomSoundDB.saveEntranceSound(file, file.name, durationValidation.duration!);
				const savedSound = await CustomSoundDB.getEntranceSound();
				setEntranceSound(savedSound);

				ToastActionCreators.createToast({
					type: 'success',
					children: t`Entrance sound uploaded successfully`,
				});
			} catch (error) {
				console.error('Failed to upload entrance sound:', error);
				ToastActionCreators.createToast({
					type: 'error',
					children: t`Failed to upload entrance sound`,
				});
			}
		},
		[hasPremium, t],
	);

	const remove = React.useCallback(async () => {
		try {
			await CustomSoundDB.deleteEntranceSound();
			setEntranceSound(null);

			ToastActionCreators.createToast({
				type: 'success',
				children: t`Entrance sound removed`,
			});
		} catch (error) {
			console.error('Failed to delete entrance sound:', error);
			ToastActionCreators.createToast({
				type: 'error',
				children: t`Failed to remove entrance sound`,
			});
		}
	}, [t]);

	const preview = React.useCallback(async () => {
		if (!entranceSound || isPreviewing) return;

		try {
			setIsPreviewing(true);
			const url = URL.createObjectURL(entranceSound.blob);
			const audio = new Audio(url);

			audio.onended = () => {
				URL.revokeObjectURL(url);
				setIsPreviewing(false);
			};

			audio.onerror = () => {
				URL.revokeObjectURL(url);
				setIsPreviewing(false);
			};

			await audio.play();
		} catch (error) {
			console.error('Failed to preview entrance sound:', error);
			setIsPreviewing(false);
		}
	}, [entranceSound, isPreviewing]);

	const openUploadDialog = React.useCallback(async () => {
		if (!hasPremium) {
			PremiumModalActionCreators.open();
			return;
		}
		const [file] = await openFilePicker({accept: CustomSoundDB.SUPPORTED_MIME_TYPES.join(',')});
		await upload(file ?? null);
	}, [hasPremium, upload]);

	return {
		entranceSound,
		isPreviewing,
		upload,
		remove,
		preview,
		openUploadDialog,
	};
};
