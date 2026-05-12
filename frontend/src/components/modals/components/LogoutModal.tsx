/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import * as AuthenticationActionCreators from '~/actions/AuthenticationActionCreators';
import {ConfirmModal} from '~/components/modals/ConfirmModal';

export const LogoutModal = observer(() => {
	const {t} = useLingui();
	return (
		<ConfirmModal
			title={t`Log out`}
			description={<Trans>Are you sure you want to log out?</Trans>}
			primaryText={t`Log out`}
			secondaryText={t`Cancel`}
			onPrimary={() => AuthenticationActionCreators.logout()}
		/>
	);
});
