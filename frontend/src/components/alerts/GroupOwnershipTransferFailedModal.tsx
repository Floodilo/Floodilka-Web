/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type {ReactElement} from 'react';
import {GenericErrorModal} from './GenericErrorModal';

export const GroupOwnershipTransferFailedModal: React.FC<{username?: string}> = observer(({username}) => {
	const {t} = useLingui();
	const message: ReactElement = (
		<Trans>
			Ownership could not be transferred to <strong>{username}</strong> at this time.
		</Trans>
	);
	return <GenericErrorModal title={t`Failed to transfer ownership`} message={message} />;
});
