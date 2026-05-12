/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import type React from 'react';
import {Accordion} from '~/components/uikit/Accordion/Accordion';
import styles from './SettingsSection.module.css';

export interface SettingsSectionProps {
	id: string;
	title: React.ReactNode;
	description?: React.ReactNode;
	isAdvanced?: boolean;
	defaultExpanded?: boolean;
	children: React.ReactNode;
	className?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
	id,
	title,
	description,
	isAdvanced = false,
	defaultExpanded = true,
	children,
	className,
}) => {
	if (isAdvanced) {
		return (
			<Accordion
				id={id}
				title={title}
				description={description}
				defaultExpanded={defaultExpanded}
				className={className}
			>
				{children}
			</Accordion>
		);
	}

	return (
		<section id={id} className={clsx(styles.section, className)}>
			<div className={styles.sectionHeader}>
				<h3 className={styles.sectionTitle}>{title}</h3>
				{description ? <p className={styles.sectionDescription}>{description}</p> : null}
			</div>
			<div className={styles.sectionContent}>{children}</div>
		</section>
	);
};
