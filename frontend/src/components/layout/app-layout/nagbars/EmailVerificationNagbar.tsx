/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {Nagbar} from '~/components/layout/Nagbar';
import {NagbarButton} from '~/components/layout/NagbarButton';
import {NagbarContent} from '~/components/layout/NagbarContent';
import {UserSettingsModal} from '~/components/modals/UserSettingsModal';
import UserStore from '~/stores/UserStore';

export const EmailVerificationNagbar = observer(({isMobile}: {isMobile: boolean}) => {
	const user = UserStore.currentUser;
	if (!user) {
		return null;
	}

	const openUserSettings = () => {
		ModalActionCreators.push(modal(() => <UserSettingsModal initialTab="account_security" />));
	};

	return (
		<Nagbar isMobile={isMobile} backgroundColor="#ea580c" textColor="#ffffff">
			<NagbarContent
				isMobile={isMobile}
				message={<Trans>Hey {user.displayName}, please verify your email address.</Trans>}
				actions={
					<NagbarButton isMobile={isMobile} onClick={openUserSettings}>
						<Trans>Open Settings</Trans>
					</NagbarButton>
				}
			/>
		</Nagbar>
	);
});
