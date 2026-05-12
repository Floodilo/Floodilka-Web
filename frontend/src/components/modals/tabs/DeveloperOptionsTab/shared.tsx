/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageDescriptor} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import type {DeveloperOptionsState} from '~/stores/DeveloperOptionsStore';

export interface ToggleDef {
	key: keyof DeveloperOptionsState;
	label: MessageDescriptor;
	description?: MessageDescriptor;
}

export interface ToggleGroup {
	title: MessageDescriptor;
	items: Array<ToggleDef>;
}

export const getToggleGroups = (): Array<ToggleGroup> => [
	{
		title: msg`App State`,
		items: [
			{key: 'bypassSplashScreen', label: msg`Bypass Splash Screen`},
			{key: 'forceUpdateReady', label: msg`Force Update Ready`},
			{key: 'showMyselfTyping', label: msg`Show Myself Typing`},
			{
				key: 'selfHostedModeOverride',
				label: msg`Self-Hosted Mode Override`,
				description: msg`Enable self-hosted mode client-side (hides all premium/billing UI, grants everyone premium)`,
			},
		],
	},
	{
		title: msg`UI Components`,
		items: [
			{key: 'forceGifPickerLoading', label: msg`Force GIF Picker Loading`},
			{
				key: 'forceShowVanityURLDisclaimer',
				label: msg`Force Show Vanity URL Disclaimer`,
				description: msg`Always show the vanity URL disclaimer warning in guild settings`,
			},
		],
	},
	{
		title: msg`Networking & Performance`,
		items: [
			{key: 'slowMessageLoad', label: msg`Slow Message Load`},
			{key: 'slowMessageSend', label: msg`Slow Message Send`},
			{key: 'slowMessageEdit', label: msg`Slow Message Edit`},
			{key: 'slowAttachmentUpload', label: msg`Slow Attachment Upload`},
			{key: 'slowProfileLoad', label: msg`Slow Profile Load`},
			{
				key: 'forceProfileDataWarning',
				label: msg`Force Profile Data Warning`,
				description: msg`Always show the profile data warning indicator, even when the profile loads successfully`,
			},
			{key: 'forceFailUploads', label: msg`Force Fail Uploads`},
			{key: 'forceFailMessageSends', label: msg`Force Fail Message Sends`},
		],
	},
	{
		title: msg`Features`,
		items: [
			{
				key: 'forceUnknownMessageType',
				label: msg`Force Unknown Message Type`,
				description: msg`Render all your messages as unknown message type`,
			},
			{
				key: 'forceShowVoiceConnection',
				label: msg`Force Show Voice Connection`,
				description: msg`Always display the voice connection status bar in mocked mode`,
			},
		],
	},
	{
		title: msg`Logging & Diagnostics`,
		items: [{key: 'debugLogging', label: msg`Debug Logging`}],
	},
];
