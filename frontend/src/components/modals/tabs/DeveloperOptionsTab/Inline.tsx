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
import ConnectionStore from '~/stores/ConnectionStore';
import NagbarStore from '~/stores/NagbarStore';
import UserStore from '~/stores/UserStore';
import {AccountPremiumTabContent} from './AccountPremiumTab';
import {GeneralTabContent} from './GeneralTab';
import styles from './Inline.module.css';
import {MockingTabContent} from './MockingTab';
import {NagbarsTabContent} from './NagbarsTab';
import {ToolsTabContent} from './ToolsTab';

export const DeveloperOptionsInlineTab: React.FC = observer(() => {
	const {t} = useLingui();
	const socket = ConnectionStore.socket;
	const nagbarState = NagbarStore;
	const user = UserStore.currentUser;

	if (!(user && socket)) return null;

	return (
		<div className={styles.container}>
			<SettingsSection id="dev-general" title={t`General`}>
				<GeneralTabContent />
			</SettingsSection>
			<SettingsSection id="dev-account-premium" title={t`Account & Premium`}>
				<AccountPremiumTabContent user={user} />
			</SettingsSection>
			<SettingsSection id="dev-mocking" title={t`Mocking`}>
				<MockingTabContent />
			</SettingsSection>
			<SettingsSection id="dev-nagbars" title={t`Nagbars`}>
				<NagbarsTabContent nagbarState={nagbarState} />
			</SettingsSection>
			<SettingsSection id="dev-tools" title={t`Tools`}>
				<ToolsTabContent socket={socket} />
			</SettingsSection>
		</div>
	);
});
