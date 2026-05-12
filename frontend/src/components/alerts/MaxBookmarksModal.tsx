/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Plural, Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {modal, push} from '~/actions/ModalActionCreators';
import {ConfirmModal} from '~/components/modals/ConfirmModal';
import {PremiumModal} from '~/components/modals/PremiumModal';
import UserStore from '~/stores/UserStore';

export const MaxBookmarksModal = observer(() => {
	const {t} = useLingui();
	const currentUser = UserStore.currentUser!;
	const isPremium = currentUser.isPremium();
	const maxBookmarks = currentUser.maxBookmarks;

	if (isPremium) {
		return (
			<ConfirmModal
				title={t`Bookmark Limit Reached`}
				description={
					<Trans>
						You've reached the maximum number of bookmarks (
						<Plural value={maxBookmarks} one="# bookmark" other="# bookmarks" />
						). Please remove some bookmarks before adding new ones.
					</Trans>
				}
				primaryText={t`Understood`}
				onPrimary={() => {}}
			/>
		);
	}

	return (
		<ConfirmModal
			title={t`Bookmark Limit Reached`}
			description={
				<Trans>
					You've reached the maximum number of bookmarks for free users (
					<Plural value={maxBookmarks} one="# bookmark" other="# bookmarks" />
					). Upgrade to Premium to increase your limit to 300 bookmarks, or remove some bookmarks to add new ones.
				</Trans>
			}
			primaryText={t`Upgrade to Premium`}
			primaryVariant="primary"
			onPrimary={() => push(modal(() => <PremiumModal />))}
			secondaryText={t`Dismiss`}
		/>
	);
});
