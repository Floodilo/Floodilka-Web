/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useCallback} from 'react';
import SudoPromptStore, {type SudoVerificationPayload} from '~/stores/SudoPromptStore';
import SudoStore from '~/stores/SudoStore';

export const useSudo = () => {
	const require = useCallback(async (): Promise<SudoVerificationPayload> => {
		if (SudoStore.hasValidToken()) {
			return {};
		}
		return await SudoPromptStore.requestVerification();
	}, []);

	const finalize = useCallback(() => {
		SudoPromptStore.handleTokenReceived(null);
	}, []);

	return {require, finalize};
};
