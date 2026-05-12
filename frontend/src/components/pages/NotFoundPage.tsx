/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {Button} from '~/components/uikit/Button/Button';
import {useDocumentTitle} from '~/hooks/useDocumentTitle';
import {Link} from '~/lib/router';
import {Routes} from '~/Routes';
import styles from './NotFoundPage.module.css';

export const NotFoundPage = observer(function NotFoundPage() {
	useDocumentTitle('Not Found');

	return (
		<div className={styles.container}>
			<img src="/icons/favicon.svg" alt="Флудилка" className={styles.icon} />
			<div className={styles.content}>
				<h1 className={styles.title}>
					<Trans>404: Page Not Found</Trans>
				</h1>
				<p className={styles.description}>
					<Trans>The page you're looking for doesn't exist or has been moved.</Trans>
				</p>
			</div>
			<div className={styles.actions}>
				<Link to={Routes.HOME}>
					<Button variant="inverted">
						<Trans>Go to Home</Trans>
					</Button>
				</Link>
			</div>
		</div>
	);
});
