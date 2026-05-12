/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import * as AccessibilityActionCreators from '~/actions/AccessibilityActionCreators';
import {Slider} from '~/components/uikit/Slider';
import AccessibilityStore from '~/stores/AccessibilityStore';
import KeybindStore from '~/stores/KeybindStore';
import {formatKeyCombo} from '~/utils/KeybindUtils';
import {isDesktop} from '~/utils/NativeUtils';

export const ChatFontScalingTabContent: React.FC = observer(() => {
	const fontSize = AccessibilityStore.fontSize;

	return (
		<Slider
			defaultValue={fontSize}
			factoryDefaultValue={16}
			markers={[12, 14, 15, 16, 18, 20, 24]}
			stickToMarkers={true}
			onValueChange={(value) => AccessibilityActionCreators.update({fontSize: value})}
			onMarkerRender={(value) => `${value}px`}
		/>
	);
});

export const AppZoomLevelTabContent: React.FC = observer(() => {
	const zoomLevel = AccessibilityStore.zoomLevel;

	return (
		<Slider
			defaultValue={Math.round(zoomLevel * 100)}
			factoryDefaultValue={100}
			minValue={50}
			maxValue={200}
			step={10}
			markers={[50, 75, 100, 125, 150, 175, 200]}
			stickToMarkers={true}
			onValueChange={(value) => AccessibilityActionCreators.update({zoomLevel: value / 100})}
			onMarkerRender={(value) => `${value}%`}
			onValueRender={(value) => <Trans>{value}%</Trans>}
		/>
	);
});

export type LinguiT = (literals: TemplateStringsArray, ...placeholders: Array<unknown>) => string;

export function getAppZoomLevelDescription(t: LinguiT): string {
	const zoomIn = formatKeyCombo(KeybindStore.getByAction('zoom_in').combo);
	const zoomOut = formatKeyCombo(KeybindStore.getByAction('zoom_out').combo);

	return t`Adjust the overall zoom level of the app. Use ${zoomIn} / ${zoomOut} to adjust quickly.`;
}

export function shouldShowAppZoomLevel(): boolean {
	return isDesktop();
}
