/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {AuthBottomLink} from '~/components/auth/AuthBottomLink';
import sharedStyles from '~/components/auth/AuthPageStyles.module.css';
import {AuthRegisterFormCore} from '~/components/auth/AuthRegisterFormCore';
import {useDocumentTitle} from '~/hooks/useDocumentTitle';
import {useLocation} from '~/lib/router';

const RegisterPageContent = observer(function RegisterPageContent() {
	const location = useLocation();
	const params = new URLSearchParams(location.search);
	const rawRedirect = params.get('redirect_to');
	const redirectTo = rawRedirect || '/';

	return (
		<>
			<h1 className={sharedStyles.title}>
				<Trans>Create an account</Trans>
			</h1>

			<div className={sharedStyles.container}>
				<AuthRegisterFormCore
					fields={{
						showEmail: true,
						showPassword: true,
						showUsernameValidation: true,
					}}
					submitLabel={<Trans>Create account</Trans>}
					redirectPath={redirectTo}
				/>

				<AuthBottomLink
					variant="login"
					to={`/login${rawRedirect ? `?redirect_to=${encodeURIComponent(rawRedirect)}` : ''}`}
				/>
			</div>
		</>
	);
});

const RegisterPage = observer(function RegisterPage() {
	const {t} = useLingui();
	useDocumentTitle(t`Register`);

	return <RegisterPageContent />;
});

export default RegisterPage;
