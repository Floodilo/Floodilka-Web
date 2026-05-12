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
import {SettingsTabContainer, SettingsTabContent} from '~/components/modals/shared/SettingsTabLayout';
import {CommunicationTabContent} from './PrivacySafetyTab/CommunicationTab';
import {ConnectionsTabContent} from './PrivacySafetyTab/ConnectionsTab';
import {DataDeletionTabContent} from './PrivacySafetyTab/DataDeletionTab';
import {DataExportTabContent} from './PrivacySafetyTab/DataExportTab';

const PrivacySafetyTab: React.FC = observer(() => {
	const {t} = useLingui();
	return (
		<SettingsTabContainer>
			<SettingsTabContent>
				<SettingsSection
					id="connections"
					title={t`Connections`}
					description={t`Control who can send you friend requests and direct messages`}
				>
					<ConnectionsTabContent />
				</SettingsSection>

				<SettingsSection
					id="communication"
					title={t`Communication`}
					description={t`Control who can call you and add you to group chats`}
				>
					<CommunicationTabContent />
				</SettingsSection>

				<SettingsSection
					id="data-export"
					title={t`Data Export`}
					description={t`Download a complete package of your account data, including all messages and attachment URLs`}
					isAdvanced
					defaultExpanded={false}
				>
					<DataExportTabContent />
				</SettingsSection>

				<SettingsSection
					id="data-deletion"
					title={t`Data Deletion`}
					description={t`Permanently delete all messages you have sent across the platform`}
					isAdvanced
					defaultExpanded={false}
				>
					<DataDeletionTabContent />
				</SettingsSection>
			</SettingsTabContent>
		</SettingsTabContainer>
	);
});

export default PrivacySafetyTab;
