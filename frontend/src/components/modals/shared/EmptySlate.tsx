/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';
import styles from './EmptySlate.module.css';

interface EmptySlateProps {
	Icon: React.ComponentType<React.ComponentProps<'svg'>>;
	title: React.ReactNode;
	description: React.ReactNode;
	fullHeight?: boolean;
}

export const EmptySlate: React.FC<EmptySlateProps> = observer(({Icon, title, description, fullHeight = false}) => {
	return (
		<div className={`${styles.container} ${fullHeight ? styles.containerFullHeight : ''}`}>
			<Icon className={styles.icon} aria-hidden={true} />
			<h3 className={styles.title}>{title}</h3>
			<p className={styles.description}>{description}</p>
		</div>
	);
});
