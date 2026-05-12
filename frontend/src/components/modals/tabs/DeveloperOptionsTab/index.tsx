/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {SettingsSection} from '~/components/modals/shared/SettingsSection';
import {SettingsTabContainer, SettingsTabContent} from '~/components/modals/shared/SettingsTabLayout';
import ConnectionStore from '~/stores/ConnectionStore';
import NagbarStore from '~/stores/NagbarStore';
import UserStore from '~/stores/UserStore';
import {AccountPremiumTabContent} from './AccountPremiumTab';
import {GeneralTabContent} from './GeneralTab';
import {MockingTabContent} from './MockingTab';
import {NagbarsTabContent} from './NagbarsTab';
import {ToolsTabContent} from './ToolsTab';
import {TypographyTabContent} from './TypographyTab';

const DeveloperOptionsTab: React.FC = observer(() => {
	const socket = ConnectionStore.socket;
	const nagbarState = NagbarStore;
	const user = UserStore.currentUser;

	if (!(user && socket)) return null;

	return (
		<SettingsTabContainer>
			<SettingsTabContent>
				<SettingsSection id="general" title={<Trans>General</Trans>}>
					<GeneralTabContent />
				</SettingsSection>

				<SettingsSection id="account_premium" title={<Trans>Account & Premium</Trans>}>
					<AccountPremiumTabContent user={user} />
				</SettingsSection>

				<SettingsSection id="mocking" title={<Trans>Mocking</Trans>}>
					<MockingTabContent />
				</SettingsSection>

				<SettingsSection id="nagbars" title={<Trans>Nagbars</Trans>}>
					<NagbarsTabContent nagbarState={nagbarState} />
				</SettingsSection>

				<SettingsSection id="tools" title={<Trans>Tools</Trans>}>
					<ToolsTabContent socket={socket} />
				</SettingsSection>

				<SettingsSection id="typography" title={<Trans>Typography</Trans>}>
					<TypographyTabContent />
				</SettingsSection>
			</SettingsTabContent>
		</SettingsTabContainer>
	);
});

export default DeveloperOptionsTab;
