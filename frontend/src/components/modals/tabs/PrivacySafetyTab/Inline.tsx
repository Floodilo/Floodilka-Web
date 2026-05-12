/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {SettingsSection} from '~/components/modals/shared/SettingsSection';
import {CommunicationTabContent as CommunicationTab} from './CommunicationTab';
import {ConnectionsTabContent as ConnectionsTab} from './ConnectionsTab';
import styles from './Inline.module.css';

export const PrivacySafetyInlineTab: React.FC = observer(() => {
	const {t} = useLingui();
	return (
		<div className={styles.container}>
			<SettingsSection id="connections" title={t`Connections`}>
				<ConnectionsTab />
			</SettingsSection>
			<SettingsSection id="communication" title={t`Communication`}>
				<CommunicationTab />
			</SettingsSection>
		</div>
	);
});
