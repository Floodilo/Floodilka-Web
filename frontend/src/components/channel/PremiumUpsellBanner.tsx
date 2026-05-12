/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import * as PremiumModalActionCreators from '~/actions/PremiumModalActionCreators';
import {PremiumUpsell} from '~/components/uikit/PremiumUpsell/PremiumUpsell';
import DismissedUpsellStore from '~/stores/DismissedUpsellStore';
import styles from './PremiumUpsellBanner.module.css';

export const PremiumUpsellBanner = observer(({message}: {message?: string}) => {
	if (DismissedUpsellStore.pickerPremiumUpsellDismissed) {
		return null;
	}

	const handleClick = () => {
		PremiumModalActionCreators.open();
	};

	const handleDismiss = () => {
		DismissedUpsellStore.dismissPickerPremiumUpsell();
	};

	return (
		<PremiumUpsell className={styles.banner} onButtonClick={handleClick} dismissible={true} onDismiss={handleDismiss}>
			{message ?? <Trans>Unlock all custom emojis and stickers across all communities with Premium</Trans>}
		</PremiumUpsell>
	);
});
