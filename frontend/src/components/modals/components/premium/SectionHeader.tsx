/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
	title: React.ReactNode;
	description?: React.ReactNode;
	align?: 'left' | 'center';
}

export const SectionHeader: React.FC<SectionHeaderProps> = observer(({title, description, align = 'left'}) => (
	<div className={clsx(styles.header, align === 'center' && styles.headerCenter)}>
		<h2 className={styles.title}>{title}</h2>
		{description ? <p className={styles.description}>{description}</p> : null}
	</div>
));
