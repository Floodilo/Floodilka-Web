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
import {DisplayTabContent} from './DisplayTab';
import styles from './Inline.module.css';
import {InputTabContent} from './InputTab';
import {InteractionTabContent} from './InteractionTab';
import {MediaTabContent} from './MediaTab';

export const ChatSettingsInlineTab: React.FC = observer(() => {
	const {t} = useLingui();
	return (
		<div className={styles.container}>
			<SettingsSection id="chat-display" title={t`Display`}>
				<DisplayTabContent />
			</SettingsSection>
			<SettingsSection id="chat-media" title={t`Media`}>
				<MediaTabContent />
			</SettingsSection>
			<SettingsSection id="chat-input" title={t`Input`}>
				<InputTabContent />
			</SettingsSection>
			<SettingsSection id="chat-interaction" title={t`Interaction`}>
				<InteractionTabContent />
			</SettingsSection>
		</div>
	);
});
