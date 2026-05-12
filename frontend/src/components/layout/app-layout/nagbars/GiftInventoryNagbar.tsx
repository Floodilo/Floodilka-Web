/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Plural, Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {Nagbar} from '~/components/layout/Nagbar';
import {NagbarButton} from '~/components/layout/NagbarButton';
import {NagbarContent} from '~/components/layout/NagbarContent';
import {UserSettingsModal} from '~/components/modals/UserSettingsModal';
import UserStore from '~/stores/UserStore';

export const GiftInventoryNagbar = observer(({isMobile}: {isMobile: boolean}) => {
	const currentUser = UserStore.currentUser;
	const unreadCount = currentUser?.unreadGiftInventoryCount ?? 1;

	const handleOpenGiftInventory = () => {
		ModalActionCreators.push(modal(() => <UserSettingsModal initialTab="gift_inventory" />));
	};

	return (
		<Nagbar isMobile={isMobile} backgroundColor="var(--brand-primary)" textColor="var(--text-on-brand-primary)">
			<NagbarContent
				isMobile={isMobile}
				message={
					<Plural
						value={unreadCount}
						one="You have a new gift code waiting in your Gift Inventory."
						other="You have # new gift codes waiting in your Gift Inventory."
					/>
				}
				actions={
					<NagbarButton isMobile={isMobile} onClick={handleOpenGiftInventory}>
						<Trans>View Gift Inventory</Trans>
					</NagbarButton>
				}
			/>
		</Nagbar>
	);
});
