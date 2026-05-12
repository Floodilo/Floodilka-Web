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

export const KeyboardTabContent: React.FC = observer(() => {
	const {t} = useLingui();
	const showTextareaFocusRing = AccessibilityStore.showTextareaFocusRing;
	const escapeExitsKeyboardMode = AccessibilityStore.escapeExitsKeyboardMode;

	return (
		<>
			<Switch
				label={t`Show focus ring on chat textarea`}
				description={t`Display a visible focus indicator around the message input when focused. Disable for a more subtle appearance.`}
				value={showTextareaFocusRing}
				onChange={(value) => AccessibilityActionCreators.update({showTextareaFocusRing: value})}
			/>

			<Switch
				label={t`Escape key exits keyboard mode`}
				description={t`Allow pressing Escape to exit keyboard navigation mode. Note: This may conflict with other uses of Escape.`}
				value={escapeExitsKeyboardMode}
				onChange={(value) => AccessibilityActionCreators.update({escapeExitsKeyboardMode: value})}
			/>
		</>
	);
});
