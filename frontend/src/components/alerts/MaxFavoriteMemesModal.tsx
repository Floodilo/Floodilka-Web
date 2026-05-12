/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {modal, push} from '~/actions/ModalActionCreators';
import {ConfirmModal} from '~/components/modals/ConfirmModal';
import {PremiumModal} from '~/components/modals/PremiumModal';
import UserStore from '~/stores/UserStore';

export const MaxFavoriteMemesModal = observer(function MaxFavoriteMemesModal() {
	const {t} = useLingui();
	const currentUser = UserStore.currentUser;
	const isPremium = currentUser?.isPremium() ?? false;

	if (isPremium) {
		return (
			<ConfirmModal
				title={t`Saved Media Limit Reached`}
				description={t`You've reached the maximum limit of 500 saved media items for Premium users. To add more, you'll need to remove some existing items from your collection.`}
				secondaryText={t`Close`}
			/>
		);
	}

	return (
		<ConfirmModal
			title={t`Saved Media Limit Reached`}
			description={t`You've reached the maximum limit of 50 saved media items for free users. Upgrade to Premium to increase your limit to 500 saved media items!`}
			primaryText={t`Upgrade to Premium`}
			primaryVariant="primary"
			onPrimary={() => push(modal(() => <PremiumModal />))}
			secondaryText={t`Maybe Later`}
		/>
	);
});
