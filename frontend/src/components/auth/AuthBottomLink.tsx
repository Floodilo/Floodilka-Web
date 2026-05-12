/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import styles from './AuthPageStyles.module.css';
import {AuthRouterLink} from './AuthRouterLink';

interface AuthBottomLinkProps {
	variant: 'login' | 'register';
	to: string;
}

export function AuthBottomLink({variant, to}: AuthBottomLinkProps) {
	return (
		<div className={styles.bottomLink}>
			<span className={styles.bottomLinkText}>
				{variant === 'login' ? <Trans>Already have an account?</Trans> : <Trans>Need an account?</Trans>}{' '}
			</span>
			<AuthRouterLink to={to} className={styles.bottomLinkAnchor}>
				{variant === 'login' ? <Trans>Log in</Trans> : <Trans>Register</Trans>}
			</AuthRouterLink>
		</div>
	);
}

interface AuthBottomLinksProps {
	children: React.ReactNode;
}

export function AuthBottomLinks({children}: AuthBottomLinksProps) {
	return <div className={styles.bottomLinks}>{children}</div>;
}
