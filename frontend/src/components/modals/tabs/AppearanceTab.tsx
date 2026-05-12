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
import {InterfaceTabContent} from './AppearanceTab/InterfaceTab';
import {AppearanceTabPreview, MessagesTabContent} from './AppearanceTab/MessagesTab';
import {
	AppZoomLevelTabContent,
	ChatFontScalingTabContent,
	getAppZoomLevelDescription,
	shouldShowAppZoomLevel,
} from './AppearanceTab/ScalingTab';

const AppearanceTab: React.FC = observer(() => {
	const {t} = useLingui();
	const showZoomLevel = shouldShowAppZoomLevel();

	return (
		<SettingsTabContainer>
			<SettingsTabContent>
				<SettingsSection
					id="chat-font-scaling"
					title={t`Chat font scaling`}
					description={t`Adjust the font size in the chat area.`}
				>
					<ChatFontScalingTabContent />
				</SettingsSection>

				{showZoomLevel ? (
					<SettingsSection id="app-zoom-level" title={t`App zoom level`} description={getAppZoomLevelDescription(t)}>
						<AppZoomLevelTabContent />
					</SettingsSection>
				) : null}

				<SettingsSection
					id="messages"
					title={t`Messages`}
					description={t`Choose how messages are displayed in chat channels.`}
				>
					<MessagesTabContent />
				</SettingsSection>

				<SettingsSection
					id="interface"
					title={t`Interface`}
					description={t`Customize interface elements and behaviors.`}
				>
					<InterfaceTabContent />
				</SettingsSection>
			</SettingsTabContent>
		</SettingsTabContainer>
	);
});

export {AppearanceTabPreview};
export default AppearanceTab;
