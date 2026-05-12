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
import NotificationStore from '~/stores/NotificationStore';
import SoundStore from '~/stores/SoundStore';
import styles from './Inline.module.css';
import {Notifications} from './Notifications';
import {Sounds} from './Sounds';
import {useSoundSettings} from './useSoundSettings';

export const NotificationsInlineTab: React.FC = observer(() => {
	const {t} = useLingui();
	const browserNotificationsEnabled = NotificationStore.browserNotificationsEnabled;
	const unreadMessageBadgeEnabled = NotificationStore.unreadMessageBadgeEnabled;
	const soundSettings = SoundStore.settings;

	const {
		hasPremium,
		soundTypeLabels,
		customSounds,
		handleToggleAllSounds,
		handleToggleSound,
		handleEnableAllSounds,
		handleDisableAllSounds,
		handlePreviewSound,
		handleUploadClick,
		handleCustomSoundDelete,
	} = useSoundSettings();

	return (
		<div className={styles.container}>
			<SettingsSection id="notifications" title={t`Notifications`}>
				<Notifications
					browserNotificationsEnabled={browserNotificationsEnabled}
					unreadMessageBadgeEnabled={unreadMessageBadgeEnabled}
				/>
			</SettingsSection>
			<SettingsSection id="sounds" title={t`Sounds`}>
				<Sounds
					soundSettings={soundSettings}
					hasPremium={hasPremium}
					soundTypeLabels={soundTypeLabels}
					customSounds={customSounds}
					onToggleAllSounds={handleToggleAllSounds}
					onToggleSound={handleToggleSound}
					onEnableAllSounds={handleEnableAllSounds}
					onDisableAllSounds={handleDisableAllSounds}
					onPreviewSound={handlePreviewSound}
					onUploadClick={handleUploadClick}
					onCustomSoundDelete={handleCustomSoundDelete}
				/>
			</SettingsSection>
		</div>
	);
});
