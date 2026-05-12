/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import * as CallActionCreators from '~/actions/CallActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {CallNotRingableModal} from '~/components/alerts/CallNotRingableModal';

export async function checkAndStartCall(channelId: string, silent = false): Promise<boolean> {
	try {
		const {ringable} = await CallActionCreators.checkCallEligibility(channelId);
		if (!ringable) {
			ModalActionCreators.push(modal(() => <CallNotRingableModal />));
			return false;
		}
		CallActionCreators.startCall(channelId, silent);
		return true;
	} catch (error) {
		console.error('Failed to check call eligibility:', error);
		return false;
	}
}
