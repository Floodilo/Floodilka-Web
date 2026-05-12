/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import {useEffect} from 'react';
import AuthModal from '~/components/auth/AuthModal';
import {useSEO} from '~/hooks/useSEO';
import AuthenticationStore from '~/stores/AuthenticationStore';
import * as RouterUtils from '~/utils/RouterUtils';

interface AuthPageProps {
	initialMode?: 'login' | 'register';
}

const AuthPage = observer(function AuthPage({initialMode = 'login'}: AuthPageProps) {
	useSEO({
		title: initialMode === 'login' ? 'Войти — Флудилка' : 'Регистрация — Флудилка',
		description: initialMode === 'login'
			? 'Войдите в свой аккаунт Флудилки — бесплатного голосового чата для геймеров.'
			: 'Создайте аккаунт в Флудилке — бесплатном голосовом мессенджере для геймеров. Альтернатива Discord в России.',
		canonicalPath: initialMode === 'login' ? '/login' : '/register',
		noindex: true,
	});

	useEffect(() => {
		if (AuthenticationStore.isAuthenticated) {
			const qp = new URLSearchParams(window.location.search);
			const redirectTo = qp.get('redirect_to');
			const safeRedirect = redirectTo && !redirectTo.startsWith('/login') && !redirectTo.startsWith('/register') ? redirectTo : '/channels/@me';
			RouterUtils.replaceWith(safeRedirect);
		}
	}, []);

	if (AuthenticationStore.isAuthenticated) {
		return null;
	}

	return <AuthModal initialMode={initialMode} />;
});

export default AuthPage;
