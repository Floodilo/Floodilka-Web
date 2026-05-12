/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {ConfirmModal} from '~/components/modals/ConfirmModal';

interface AudioPlaybackPermissionModalProps {
	onStartAudio: () => Promise<void>;
}

export const AudioPlaybackPermissionModal = observer(({onStartAudio}: AudioPlaybackPermissionModalProps) => {
	const {t} = useLingui();
	return (
		<ConfirmModal
			title={t`Browser Audio Required`}
			description={t`Your browser requires user interaction before audio can be played. Click the button below to enable voice chat.`}
			primaryText={t`Enable Audio`}
			primaryVariant="primary"
			secondaryText={false}
			onPrimary={onStartAudio}
		/>
	);
});
