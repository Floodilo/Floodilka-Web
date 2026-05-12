/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Icon} from '@phosphor-icons/react';
import {QuestionIcon} from '@phosphor-icons/react';
import styles from './AuthPageStyles.module.css';

interface AuthErrorStateProps {
	icon?: Icon;
	title: React.ReactNode;
	text: React.ReactNode;
}

export function AuthErrorState({icon: IconComponent = QuestionIcon, title, text}: AuthErrorStateProps) {
	return (
		<div className={styles.errorContainer}>
			<div className={styles.errorIcon}>
				<IconComponent className={styles.errorIconSvg} />
			</div>
			<h1 className={styles.errorTitle}>{title}</h1>
			<p className={styles.errorText}>{text}</p>
		</div>
	);
}
