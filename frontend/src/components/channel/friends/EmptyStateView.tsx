/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {UsersThreeIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import styles from './EmptyStateView.module.css';

export const EmptyStateView = observer(({title, subtitle}: {title: string; subtitle: string}) => (
	<div className={styles.container}>
		<UsersThreeIcon weight="fill" className={styles.icon} />
		<h2 className={styles.title}>{title}</h2>
		<p className={styles.subtitle}>{subtitle}</p>
	</div>
));
