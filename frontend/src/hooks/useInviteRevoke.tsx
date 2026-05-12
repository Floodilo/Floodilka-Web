/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import * as InviteActionCreators from '~/actions/InviteActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {InviteRevokeFailedModal} from '~/components/alerts/InviteRevokeFailedModal';

export const useInviteRevoke = (): ((code: string) => Promise<void>) => {
	return React.useCallback(async (code: string) => {
		try {
			await InviteActionCreators.remove(code);
		} catch (_error) {
			ModalActionCreators.push(modal(() => <InviteRevokeFailedModal />));
		}
	}, []);
};
