/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import type React from 'react';
import sectionStyles from './SettingsSection.module.css';
import styles from './SettingsTabLayout.module.css';

interface SettingsTabContainerProps {
	children: React.ReactNode;
	className?: string;
}

export const SettingsTabContainer: React.FC<SettingsTabContainerProps> = ({children, className}) => {
	return <div className={clsx(styles.container, className)}>{children}</div>;
};

interface SettingsTabHeaderProps {
	title: React.ReactNode;
	description?: React.ReactNode;
	className?: string;
}

export const SettingsTabHeader: React.FC<SettingsTabHeaderProps> = ({title, description, className}) => {
	return (
		<div className={clsx(styles.header, className)}>
			<h2 className={styles.title}>{title}</h2>
			{description && <p className={styles.description}>{description}</p>}
		</div>
	);
};

interface SettingsTabContentProps {
	children: React.ReactNode;
	className?: string;
}

export const SettingsTabContent: React.FC<SettingsTabContentProps> = ({children, className}) => {
	return <div className={clsx(styles.content, className)}>{children}</div>;
};

interface SettingsTabSectionProps {
	title?: React.ReactNode;
	description?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
}

export const SettingsTabSection: React.FC<SettingsTabSectionProps> = ({title, description, children, className}) => {
	return (
		<div className={clsx(styles.subsection, className)}>
			{(title || description) && (
				<div className={sectionStyles.subsectionHeader}>
					{title && <h4 className={sectionStyles.subsectionTitle}>{title}</h4>}
					{description && <p className={sectionStyles.subsectionDescription}>{description}</p>}
				</div>
			)}
			<div className={sectionStyles.subsectionContent}>{children}</div>
		</div>
	);
};
