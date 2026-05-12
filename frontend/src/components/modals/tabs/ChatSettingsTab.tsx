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
import {DisplayTabContent} from './ChatSettingsTab/DisplayTab';
import {InputTabContent} from './ChatSettingsTab/InputTab';
import {InteractionTabContent} from './ChatSettingsTab/InteractionTab';
import {MediaTabContent} from './ChatSettingsTab/MediaTab';

const ChatSettingsTab: React.FC = observer(() => {
	const {t} = useLingui();
	return (
		<SettingsTabContainer>
			<SettingsTabContent>
				<SettingsSection
					id="display"
					title={t`Display`}
					description={t`Control how messages, media, and other content are displayed.`}
				>
					<DisplayTabContent />
				</SettingsSection>

				<SettingsSection id="media" title={t`Media`} description={t`Customize media size preferences and buttons.`}>
					<MediaTabContent />
				</SettingsSection>

				<SettingsSection id="input" title={t`Input`} description={t`Customize message input settings.`}>
					<InputTabContent />
				</SettingsSection>

				<SettingsSection
					id="interaction"
					title={t`Interaction`}
					description={t`Configure message interaction settings.`}
					isAdvanced
					defaultExpanded={false}
				>
					<InteractionTabContent />
				</SettingsSection>
			</SettingsTabContent>
		</SettingsTabContainer>
	);
});

export default ChatSettingsTab;
