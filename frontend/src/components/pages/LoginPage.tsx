/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {useCallback, useMemo} from 'react';

import * as AuthenticationActionCreators from '~/actions/AuthenticationActionCreators';
import {useDesktopHandoffFlow} from '~/components/auth/AuthLoginCore/useDesktopHandoffFlow';
import {AuthLoginLayout} from '~/components/auth/AuthLoginLayout';
import {AuthRouterLink} from '~/components/auth/AuthRouterLink';
import {HandoffCodeDisplay} from '~/components/auth/HandoffCodeDisplay';
import MfaScreen from '~/components/auth/MfaScreen';
import {useDocumentTitle} from '~/hooks/useDocumentTitle';
import type {LoginSuccessPayload} from '~/hooks/useLoginFlow';
import {useLocation} from '~/lib/router';
import AccountManager from '~/stores/AccountManager';
import AuthenticationStore from '~/stores/AuthenticationStore';
import * as RouterUtils from '~/utils/RouterUtils';

const LoginPage = observer(function LoginPage() {
	const location = useLocation();
	const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

	const rawRedirect = params.get('redirect_to');
	const isDesktopHandoff = params.get('desktop_handoff') === '1';
	const initialEmail = params.get('email') ?? undefined;

	const redirectPath = isDesktopHandoff ? undefined : rawRedirect || '/';

	return (
		<AuthLoginLayout
			redirectPath={redirectPath}
			desktopHandoff={isDesktopHandoff}
			excludeCurrentUser={false}
			initialEmail={initialEmail}
			registerLink={
				<AuthRouterLink to="/register" search={{redirect_to: rawRedirect || undefined}}>
					<Trans>Register</Trans>
				</AuthRouterLink>
			}
		/>
	);
});

const LoginPageMFA = observer(function LoginPageMFA() {
	const location = useLocation();
	const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

	const isDesktopHandoff = params.get('desktop_handoff') === '1';
	const rawRedirect = params.get('redirect_to');

	const redirectTo = isDesktopHandoff ? undefined : rawRedirect || '/';

	const mfaTicket = AuthenticationStore.currentMfaTicket ?? AuthenticationStore.mfaTicket;
	const mfaMethods = AuthenticationStore.availableMfaMethods ?? AuthenticationStore.mfaMethods;

	const hasStoredAccounts = AccountManager.orderedAccounts.length > 0;

	const handoff = useDesktopHandoffFlow({
		enabled: isDesktopHandoff,
		hasStoredAccounts,
		initialMode: 'idle',
	});

	const handleMfaSuccess = useCallback(
		async ({token, userId}: LoginSuccessPayload) => {
			if (isDesktopHandoff) {
				await handoff.start({token, userId});
				return;
			} else {
				await AuthenticationActionCreators.completeLogin({token, userId});
				AuthenticationActionCreators.clearMfaTicket();

				RouterUtils.replaceWith(redirectTo || '/');
				return;
			}
		},
		[handoff, isDesktopHandoff, redirectTo],
	);

	const handleCancel = useCallback(() => {
		AuthenticationActionCreators.clearMfaTicket();
	}, []);

	if (!mfaTicket || !mfaMethods) {
		return null;
	}

	if (
		isDesktopHandoff &&
		(handoff.mode === 'generating' || handoff.mode === 'displaying' || handoff.mode === 'error')
	) {
		return (
			<HandoffCodeDisplay
				code={handoff.code}
				isGenerating={handoff.mode === 'generating'}
				error={handoff.mode === 'error' ? handoff.error : null}
				onRetry={handoff.retry}
			/>
		);
	}

	return (
		<MfaScreen challenge={{ticket: mfaTicket, ...mfaMethods}} onSuccess={handleMfaSuccess} onCancel={handleCancel} />
	);
});

const LoginPageContainer = observer(() => {
	const {t} = useLingui();
	const loginState = AuthenticationStore.loginState;

	useDocumentTitle(t`Log in`);

	switch (loginState) {
		case 'default':
			return <LoginPage />;
		case 'mfa':
			return <LoginPageMFA />;
		default:
			return null;
	}
});

export default LoginPageContainer;
