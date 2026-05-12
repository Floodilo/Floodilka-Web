/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {SettingsSection} from '~/components/modals/shared/SettingsSection';
import UserStore from '~/stores/UserStore';
import VoiceSettingsStore from '~/stores/VoiceSettingsStore';
import {VideoTab} from '../VideoTab';
import {VoiceTab} from '../VoiceTab';
import styles from './Inline.module.css';

export const VoiceVideoInlineTab: React.FC = observer(() => {
	const {t} = useLingui();
	const user = UserStore.currentUser;
	const voiceSettings = VoiceSettingsStore;
	const hasPremium = React.useMemo(() => user?.isPremium() ?? false, [user]);

	return (
		<div className={styles.container}>
			<SettingsSection id="voice-audio" title={t`Audio`}>
				<VoiceTab voiceSettings={voiceSettings} hasPremium={hasPremium} autoRequestPermission={false} />
			</SettingsSection>
			<SettingsSection id="voice-video" title={t`Video`}>
				<VideoTab voiceSettings={voiceSettings} hasPremium={hasPremium} autoRequestPermission={false} />
			</SettingsSection>
		</div>
	);
});
