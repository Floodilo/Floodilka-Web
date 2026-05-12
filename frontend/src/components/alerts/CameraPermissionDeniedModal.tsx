/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {ConfirmModal} from '~/components/modals/ConfirmModal';
import {openNativePermissionSettings} from '~/utils/NativePermissions';
import {isDesktop, isNativeMacOS} from '~/utils/NativeUtils';

export const CameraPermissionDeniedModal = observer(() => {
	const {t} = useLingui();
	if (isDesktop() && isNativeMacOS()) {
		return (
			<ConfirmModal
				title={t`Camera Permission Required`}
				description={t`Флудилка needs access to your camera. Open System Settings → Privacy & Security → Camera, allow Флудилка, and then restart the app.`}
				primaryText={t`Open Settings`}
				primaryVariant="primary"
				onPrimary={() => openNativePermissionSettings('camera')}
				secondaryText={t`Close`}
			/>
		);
	}

	const message = isDesktop()
		? t`Флудилка needs access to your camera. Allow camera access in your operating system privacy settings and restart the app.`
		: t`Флудилка needs access to your camera to enable video chat. Please grant camera permission in your browser settings and try again.`;

	return (
		<ConfirmModal
			title={t`Camera Permission Required`}
			description={message}
			primaryText={t`Understood`}
			onPrimary={() => {}}
		/>
	);
});
