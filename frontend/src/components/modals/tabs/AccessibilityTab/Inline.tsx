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
import {AnimationTabContent} from './AnimationTab';
import styles from './Inline.module.css';
import {MotionTabContent} from './MotionTab';
import {VisualTabContent} from './VisualTab';

export const AccessibilityInlineTab: React.FC = observer(() => {
	const {t} = useLingui();
	return (
		<div className={styles.container}>
			<SettingsSection id="accessibility-visual" title={t`Visual`}>
				<VisualTabContent />
			</SettingsSection>
			<SettingsSection id="accessibility-animation" title={t`Animation`}>
				<AnimationTabContent />
			</SettingsSection>
			<SettingsSection id="accessibility-motion" title={t`Motion`}>
				<MotionTabContent />
			</SettingsSection>
		</div>
	);
});
