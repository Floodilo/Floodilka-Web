/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {UserSettingsModal} from '~/components/modals/UserSettingsModal';
import {PremiumUpsell} from '~/components/uikit/PremiumUpsell/PremiumUpsell';

export const PremiumUpsellBanner: React.FC = observer(() => {
	return (
		<PremiumUpsell
			buttonText={<Trans>View Plans</Trans>}
			onButtonClick={() => {
				ModalActionCreators.pop();
				ModalActionCreators.push(modal(() => <UserSettingsModal initialTab="premium" />));
			}}
		>
			<Trans>Get Premium for yourself and unlock higher limits and exclusive features.</Trans>
		</PremiumUpsell>
	);
});
