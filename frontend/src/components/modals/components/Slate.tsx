/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Icon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {Button} from '~/components/uikit/Button/Button';
import styles from './Slate.module.css';

interface SlateProps {
	icon: Icon;
	title: string;
	description: string;
	buttonText?: string;
	onClick?: () => void;
}

export const Slate: React.FC<SlateProps> = observer(({icon: Icon, title, description, buttonText, onClick}) => (
	<div className={styles.container}>
		<div className={styles.content}>
			<div className={styles.iconTextContainer}>
				<Icon className={styles.icon} />
				<div className={styles.textContainer}>
					<h3 className={styles.title}>{title}</h3>
					<p className={styles.description}>{description}</p>
				</div>
			</div>
			{buttonText && <Button onClick={onClick}>{buttonText}</Button>}
		</div>
	</div>
));
