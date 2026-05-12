/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';
import {Button} from '~/components/uikit/Button/Button';
import styles from './StatusSlate.module.css';

interface StatusAction {
	text: React.ReactNode;
	onClick: () => void;
	variant?: React.ComponentProps<typeof Button>['variant'];
	fitContent?: boolean;
	fitContainer?: boolean;
}

interface StatusSlateProps {
	Icon: React.ComponentType<React.ComponentProps<'svg'>>;
	title: React.ReactNode;
	description: React.ReactNode;
	actions?: Array<StatusAction>;
	fullHeight?: boolean;
	iconClassName?: string;
	iconStyle?: React.CSSProperties;
}

export const StatusSlate: React.FC<StatusSlateProps> = observer(
	({Icon, title, description, actions = [], fullHeight = false, iconClassName, iconStyle}) => {
		const iconClass = [styles.icon, iconClassName].filter(Boolean).join(' ');
		return (
			<div className={`${styles.container} ${fullHeight ? styles.fullHeight : ''}`}>
				<Icon className={iconClass} style={iconStyle} aria-hidden />
				<h3 className={styles.title}>{title}</h3>
				<p className={styles.description}>{description}</p>
				{actions.length > 0 && (
					<div className={styles.actions}>
						{actions.map((action, index) => (
							<Button
								key={index}
								variant={action.variant ?? 'primary'}
								fitContent={action.fitContent ?? true}
								fitContainer={action.fitContainer ?? false}
								onClick={action.onClick}
								submitting={false}
							>
								{action.text}
							</Button>
						))}
					</div>
				)}
			</div>
		);
	},
);
