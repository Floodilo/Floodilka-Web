/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {GenericErrorModal} from './GenericErrorModal';

export const CallNotRingableModal = observer(() => {
	const {t} = useLingui();

	return (
		<GenericErrorModal
			title={t`Unable to Start Call`}
			message={t`This user is not available to receive calls right now. They may have calls disabled.`}
		/>
	);
});
