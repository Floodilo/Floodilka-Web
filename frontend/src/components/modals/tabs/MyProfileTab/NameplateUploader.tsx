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
import {modal} from '~/actions/ModalActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {AssetCropModal, AssetType} from '~/components/modals/AssetCropModal';
import {Button} from '~/components/uikit/Button/Button';
import {PremiumUpsell} from '~/components/uikit/PremiumUpsell/PremiumUpsell';
import * as AvatarUtils from '~/utils/AvatarUtils';
import {openFilePicker} from '~/utils/FilePickerUtils';
import styles from './BannerUploader.module.css';

interface NameplateUploaderProps {
	hasNameplate: boolean;
	onNameplateChange: (base64: string) => void;
	onNameplateClear: () => void;
	disabled?: boolean;
	hasPremium: boolean;
	errorMessage?: string;
}

export const NameplateUploader = observer(
	({hasNameplate, onNameplateChange, onNameplateClear, disabled, hasPremium, errorMessage}: NameplateUploaderProps) => {
		const {t} = useLingui();

		const handleNameplateUpload = React.useCallback(async () => {
			try {
				const [file] = await openFilePicker({accept: 'image/*,video/webm,video/mp4'});
				if (!file) return;

				if (file.size > 8 * 1024 * 1024) {
					ToastActionCreators.createToast({
						type: 'error',
						children: t`Nameplate file is too large. Please choose a file smaller than 8MB.`,
					});
					return;
				}

				const base64 = await AvatarUtils.fileToBase64(file);

				if (file.type.startsWith('video/')) {
					onNameplateChange(base64);
					return;
				}

				ModalActionCreators.push(
					modal(() => (
						<AssetCropModal
							imageUrl={base64}
							sourceMimeType={file.type}
							assetType={AssetType.PROFILE_NAMEPLATE}
							onCropComplete={(croppedBlob) => {
								const reader = new FileReader();
								reader.onload = () => {
									const croppedBase64 = reader.result as string;
									onNameplateChange(croppedBase64);
								};
								reader.onerror = () => {
									ToastActionCreators.createToast({
										type: 'error',
										children: t`Failed to process the cropped image. Please try again.`,
									});
								};
								reader.readAsDataURL(croppedBlob);
							}}
							onSkip={() => {
								onNameplateChange(base64);
							}}
						/>
					)),
				);
			} catch {
				ToastActionCreators.createToast({
					type: 'error',
					children: t`That image is invalid. Please try another one.`,
				});
			}
		}, [onNameplateChange, t]);

		return (
			<div>
				<div className={styles.label}>
					<Trans>Nameplate</Trans>
				</div>
				{hasPremium ? (
					<>
						<div className={styles.buttonGroup}>
							<Button variant="primary" small={true} onClick={handleNameplateUpload} disabled={disabled}>
								<Trans>Change Nameplate</Trans>
							</Button>
							{hasNameplate && (
								<Button variant="secondary" small={true} onClick={onNameplateClear} disabled={disabled}>
									<Trans>Remove Nameplate</Trans>
								</Button>
							)}
						</div>
						<div className={styles.description}>
							<Trans>
								JPEG, PNG, WebP, GIF, WebM, MP4. Max 8MB. Minimum: 480×96px (5:1). Animated content is transcoded
								to MP4.
							</Trans>
						</div>
					</>
				) : (
					<PremiumUpsell>
						<Trans>
							Stand out in the member list with a custom nameplate — a static or animated background image for your
							cell.
						</Trans>
					</PremiumUpsell>
				)}
				{errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
			</div>
		);
	},
);
