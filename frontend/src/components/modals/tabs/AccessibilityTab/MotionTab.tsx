/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import * as AccessibilityActionCreators from '~/actions/AccessibilityActionCreators';
import {Switch} from '~/components/form/Switch';
import AccessibilityStore from '~/stores/AccessibilityStore';

export const MotionTabContent: React.FC = observer(() => {
	const {t} = useLingui();
	const syncReducedMotionWithSystem = AccessibilityStore.syncReducedMotionWithSystem;
	const reducedMotionOverride = AccessibilityStore.reducedMotionOverride;

	return (
		<>
			<Switch
				label={t`Sync reduced motion setting with system`}
				description={t`Automatically use your system's reduced motion preference, or customize it below.`}
				value={syncReducedMotionWithSystem}
				onChange={(value) => AccessibilityActionCreators.update({syncReducedMotionWithSystem: value})}
			/>

			<Switch
				label={t`Reduce motion`}
				description={
					syncReducedMotionWithSystem
						? t`Disable animations and transitions. Currently controlled by your system setting.`
						: t`Disable animations and transitions throughout the app.`
				}
				value={syncReducedMotionWithSystem ? AccessibilityStore.useReducedMotion : (reducedMotionOverride ?? false)}
				disabled={syncReducedMotionWithSystem}
				onChange={(value) => AccessibilityActionCreators.update({reducedMotionOverride: value})}
			/>
		</>
	);
});
