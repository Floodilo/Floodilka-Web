/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {GenericErrorModal} from './GenericErrorModal';

export type PinFailureReason = 'dm_restricted' | 'generic';

interface PinFailedModalProps {
	isUnpin?: boolean;
	reason?: PinFailureReason;
}

export const PinFailedModal: React.FC<PinFailedModalProps> = observer(({isUnpin, reason = 'generic'}) => {
	const {t} = useLingui();
	const title = isUnpin ? t`Failed to unpin message` : t`Failed to pin message`;

	let message: string;
	switch (reason) {
		case 'dm_restricted':
			message = t`You cannot interact with this user right now.`;
			break;
		default:
			message = t`Something went wrong. Please try again later.`;
	}

	return <GenericErrorModal title={title} message={message} />;
});
