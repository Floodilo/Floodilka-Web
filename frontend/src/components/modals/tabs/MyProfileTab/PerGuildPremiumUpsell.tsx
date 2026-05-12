/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {PremiumUpsell} from '~/components/uikit/PremiumUpsell/PremiumUpsell';

export const PerGuildPremiumUpsell = observer(() => {
	return (
		<PremiumUpsell>
			<Trans>
				Customizing your avatar, banner, and bio for individual communities requires Premium. Community nickname is free
				for everyone.
			</Trans>
		</PremiumUpsell>
	);
});
