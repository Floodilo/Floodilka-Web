/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {openClaimAccountModal} from '~/components/modals/ClaimAccountModal';
import {Button} from '~/components/uikit/Button/Button';
import {WarningAlert} from '~/components/uikit/WarningAlert/WarningAlert';

export const UnclaimedAccountAlert = observer(() => {
	return (
		<WarningAlert
			title={<Trans>Unclaimed Account</Trans>}
			actions={
				<Button small={true} onClick={() => openClaimAccountModal({force: true})}>
					<Trans>Claim Account</Trans>
				</Button>
			}
		>
			<Trans>
				Your account is not yet claimed. Without an email and password, you won't be able to sign in from other devices
				and you could lose access to your account. Claim your account now to secure it.
			</Trans>
		</WarningAlert>
	);
});
