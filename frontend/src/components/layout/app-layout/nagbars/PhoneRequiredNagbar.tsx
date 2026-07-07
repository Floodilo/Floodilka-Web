/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {Nagbar} from '~/components/layout/Nagbar';
import {NagbarButton} from '~/components/layout/NagbarButton';
import {NagbarContent} from '~/components/layout/NagbarContent';
import {PhoneAddModal} from '~/components/modals/PhoneAddModal';
import UserStore from '~/stores/UserStore';

// Мягкая фаза перехода на обязательный телефон (PHONE_ENFORCEMENT_MODE=banner).
// Жёсткая фаза работает через REQUIRE_VERIFIED_PHONE + RequiredActionModal.
export const PhoneRequiredNagbar = observer(({isMobile}: {isMobile: boolean}) => {
	const user = UserStore.currentUser;
	if (!user) {
		return null;
	}

	const openPhoneAddModal = () => {
		ModalActionCreators.push(modal(() => <PhoneAddModal />));
	};

	return (
		<Nagbar isMobile={isMobile} backgroundColor="#b7791f" textColor="#ffffff">
			<NagbarContent
				isMobile={isMobile}
				message={<>По требованиям законодательства РФ к аккаунту необходимо привязать номер телефона.</>}
				actions={
					<NagbarButton isMobile={isMobile} onClick={openPhoneAddModal}>
						Привязать номер
					</NagbarButton>
				}
			/>
		</Nagbar>
	);
});
