/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import * as PremiumModalActionCreators from '~/actions/PremiumModalActionCreators';
import {ConfirmModal} from '~/components/modals/ConfirmModal';
import UserStore from '~/stores/UserStore';

export const FileSizeTooLargeModal = observer(() => {
	const {t} = useLingui();
	const user = UserStore.currentUser;
	const hasPremium = user?.isPremium() ?? false;

	if (hasPremium) {
		return (
			<ConfirmModal
				title={t`File size too large`}
				description={t`The file you're trying to upload exceeds the maximum size limit of 500 MB for Premium subscribers.`}
				primaryText={t`Understood`}
				onPrimary={() => {}}
			/>
		);
	}

	return (
		<ConfirmModal
			title={t`File Size Limit Exceeded`}
			description={t`The file you're trying to upload exceeds the maximum size limit of 25 MB for non-subscribers. With Premium, you can upload files up to 500 MB, use animated avatars and banners, write longer bios, and unlock many other premium features.`}
			primaryText={t`Get Premium`}
			primaryVariant="primary"
			onPrimary={() => PremiumModalActionCreators.open()}
			secondaryText={t`Cancel`}
		/>
	);
});
