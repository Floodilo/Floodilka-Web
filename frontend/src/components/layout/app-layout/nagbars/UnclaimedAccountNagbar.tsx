/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {Nagbar} from '~/components/layout/Nagbar';
import {NagbarButton} from '~/components/layout/NagbarButton';
import {NagbarContent} from '~/components/layout/NagbarContent';
import {openClaimAccountModal} from '~/components/modals/ClaimAccountModal';
import UserStore from '~/stores/UserStore';

export const UnclaimedAccountNagbar = observer(({isMobile}: {isMobile: boolean}) => {
	const user = UserStore.currentUser;
	if (!user) {
		return null;
	}

	const handleClaimAccount = () => {
		openClaimAccountModal({force: true});
	};

	return (
		<Nagbar isMobile={isMobile} backgroundColor="#ea580c" textColor="#ffffff">
			<NagbarContent
				isMobile={isMobile}
				message={<Trans>Hey {user.displayName}, claim your account to prevent losing access.</Trans>}
				actions={
					<NagbarButton isMobile={isMobile} onClick={handleClaimAccount}>
						<Trans>Claim Account</Trans>
					</NagbarButton>
				}
			/>
		</Nagbar>
	);
});
