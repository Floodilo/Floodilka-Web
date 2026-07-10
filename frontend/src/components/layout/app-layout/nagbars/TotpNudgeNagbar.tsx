/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import * as NagbarActionCreators from '~/actions/NagbarActionCreators';
import {Nagbar} from '~/components/layout/Nagbar';
import {NagbarButton} from '~/components/layout/NagbarButton';
import {NagbarContent} from '~/components/layout/NagbarContent';
import {UserSettingsModal} from '~/components/modals/UserSettingsModal';
import UserStore from '~/stores/UserStore';

// Мягкий нудж на включение двухфакторной аутентификации: показывается
// пользователям без 2FA, закрывается крестиком (запоминается).
export const TotpNudgeNagbar = observer(({isMobile}: {isMobile: boolean}) => {
	const user = UserStore.currentUser;
	if (!user) {
		return null;
	}

	const openSecuritySettings = () => {
		ModalActionCreators.push(modal(() => <UserSettingsModal initialTab="account_security" />));
	};

	const handleDismiss = () => {
		NagbarActionCreators.dismissNagbar('totpNudgeDismissed');
	};

	return (
		<Nagbar isMobile={isMobile} backgroundColor="#5865f2" textColor="#ffffff" dismissible onDismiss={handleDismiss}>
			<NagbarContent
				isMobile={isMobile}
				message={<>Защитите аккаунт — включите двухфакторную аутентификацию в настройках безопасности.</>}
				actions={
					<NagbarButton isMobile={isMobile} onClick={openSecuritySettings}>
						Открыть настройки
					</NagbarButton>
				}
			/>
		</Nagbar>
	);
});
