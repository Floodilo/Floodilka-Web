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
import UserStore from '~/stores/UserStore';
import VoiceSettingsStore from '~/stores/VoiceSettingsStore';
import {VideoTab} from './VideoTab';
import {VoiceTab} from './VoiceTab';

const VoiceVideoTab: React.FC = observer(() => {
	const {t} = useLingui();
	const user = UserStore.currentUser;
	const voiceSettings = VoiceSettingsStore;
	const hasPremium = user?.isPremium() ?? false;

	return (
		<SettingsTabContainer>
			<SettingsTabContent>
				<SettingsSection
					id="audio"
					title={t`Audio`}
					description={t`Configure your microphone, speakers, and input mode`}
				>
					<VoiceTab voiceSettings={voiceSettings} hasPremium={hasPremium} />
				</SettingsSection>

				<SettingsSection id="video" title={t`Video`} description={t`Configure your camera and video settings`}>
					<VideoTab voiceSettings={voiceSettings} hasPremium={hasPremium} />
				</SettingsSection>
			</SettingsTabContent>
		</SettingsTabContainer>
	);
});

export default VoiceVideoTab;
