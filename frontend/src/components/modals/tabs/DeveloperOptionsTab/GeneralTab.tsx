/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import * as DeveloperOptionsActionCreators from '~/actions/DeveloperOptionsActionCreators';
import {Switch} from '~/components/form/Switch';
import DeveloperOptionsStore from '~/stores/DeveloperOptionsStore';
import styles from './GeneralTab.module.css';
import {getToggleGroups} from './shared';

export const GeneralTabContent: React.FC = observer(() => {
	const {t} = useLingui();
	const toggleGroups = getToggleGroups();

	return (
		<>
			{toggleGroups.map((group, gi) => (
				<div
					key={group.title.id ?? `toggle-group-${gi}`}
					className={gi > 0 ? styles.toggleGroup : styles.toggleGroupFirst}
				>
					<div className={styles.groupTitle}>{t(group.title)}</div>
					<div className={styles.toggleList}>
						{group.items.map(({key, label, description}) => (
							<Switch
								key={String(key)}
								label={t(label)}
								description={description ? t(description) : undefined}
								value={Boolean(DeveloperOptionsStore[key])}
								onChange={(value) => {
									DeveloperOptionsActionCreators.updateOption(key, value);
									if (key === 'selfHostedModeOverride') {
										window.location.reload();
									}
								}}
							/>
						))}
					</div>
				</div>
			))}
		</>
	);
});
