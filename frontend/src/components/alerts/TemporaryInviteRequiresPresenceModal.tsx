/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {ConfirmModal} from '~/components/modals/ConfirmModal';

export const TemporaryInviteRequiresPresenceModal = observer(() => {
	const {t} = useLingui();

	return (
		<ConfirmModal
			title={t`Gateway Connection Required`}
			description={t`You must be connected to the gateway to accept this temporary invite. Please check your connection and try again.`}
			primaryText={t`Understood`}
			onPrimary={() => {}}
		/>
	);
});
