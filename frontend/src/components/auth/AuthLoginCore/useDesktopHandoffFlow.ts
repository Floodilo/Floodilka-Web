/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useCallback, useMemo, useState} from 'react';
import * as AuthenticationActionCreators from '~/actions/AuthenticationActionCreators';

export type DesktopHandoffMode = 'idle' | 'selecting' | 'login' | 'generating' | 'displaying' | 'error';

type Options = {
	enabled: boolean;
	hasStoredAccounts: boolean;

	initialMode?: DesktopHandoffMode;
};

export function useDesktopHandoffFlow({enabled, hasStoredAccounts, initialMode}: Options) {
	const derivedInitial = useMemo<DesktopHandoffMode>(() => {
		if (!enabled) return 'idle';
		if (initialMode) return initialMode;
		return hasStoredAccounts ? 'selecting' : 'login';
	}, [enabled, hasStoredAccounts, initialMode]);

	const [mode, setMode] = useState<DesktopHandoffMode>(derivedInitial);
	const [code, setCode] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const start = useCallback(
		async ({token, userId}: {token: string; userId: string}) => {
			if (!enabled) return;

			setMode('generating');
			setError(null);
			setCode(null);

			try {
				const result = await AuthenticationActionCreators.initiateDesktopHandoff();
				await AuthenticationActionCreators.completeDesktopHandoff({
					code: result.code,
					token,
					userId,
				});

				setCode(result.code);
				setMode('displaying');
			} catch (e) {
				setMode('error');
				setError(e instanceof Error ? e.message : String(e));
			}
		},
		[enabled],
	);

	const switchToLogin = useCallback(() => {
		setMode('login');
		setError(null);
	}, []);

	const retry = useCallback(() => {
		setError(null);
		setCode(null);
		setMode(hasStoredAccounts ? 'selecting' : 'login');
	}, [hasStoredAccounts]);

	return {
		mode,
		code,
		error,

		setMode,

		start,
		switchToLogin,
		retry,
	};
}
