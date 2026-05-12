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

export const MicrophonePermissionDeniedModal = observer(() => {
	const {t} = useLingui();

	if (isDesktop() && isNativeMacOS()) {
		return (
			<ConfirmModal
				title={t`Microphone Permission Required`}
				description={t`Флудилка needs access to your microphone. Open System Settings → Privacy & Security → Microphone, allow Флудилка, and then restart the app.`}
				primaryText={t`Open Settings`}
				primaryVariant="primary"
				onPrimary={() => openNativePermissionSettings('microphone')}
				secondaryText={t`Close`}
			/>
		);
	}

	const message = isDesktop()
		? t`Флудилка needs access to your microphone. Allow microphone access in your operating system privacy settings and restart the app.`
		: t`Флудилка needs access to your microphone to enable voice chat. Please grant microphone permission in your browser settings and try again.`;

	return (
		<ConfirmModal
			title={t`Microphone Permission Required`}
			description={message}
			primaryText={t`Understood`}
			onPrimary={() => {}}
		/>
	);
});
