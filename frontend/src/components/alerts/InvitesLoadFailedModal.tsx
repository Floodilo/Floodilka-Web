/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {GenericErrorModal} from './GenericErrorModal';

export const InvitesLoadFailedModal = observer(() => {
	const {t} = useLingui();

	return (
		<GenericErrorModal title={t`Failed to load invites`} message={t`We couldn't load the invites at this time.`} />
	);
});
