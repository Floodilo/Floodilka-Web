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

export const ScreenRecordingPermissionDeniedModal = observer(() => {
	const {t} = useLingui();

	return (
		<ConfirmModal
			title={t`Screen Recording Permission Required`}
			description={t`Флудилка needs access to screen recording. Open System Settings → Privacy & Security → Screen Recording, allow Флудилка, and then try again.`}
			primaryText={t`Open Settings`}
			primaryVariant="primary"
			onPrimary={() => openNativePermissionSettings('screen')}
			secondaryText={t`Close`}
		/>
	);
});
