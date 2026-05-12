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
import styles from './Inline.module.css';
import {InterfaceTabContent} from './InterfaceTab';
import {MessagesTabContent} from './MessagesTab';

export const AppearanceInlineTab: React.FC = observer(() => {
	const {t} = useLingui();
	return (
		<div className={styles.container}>
			<SettingsSection id="appearance-messages" title={t`Messages`}>
				<MessagesTabContent />
			</SettingsSection>
			<SettingsSection id="appearance-interface" title={t`Interface`}>
				<InterfaceTabContent />
			</SettingsSection>
		</div>
	);
});
