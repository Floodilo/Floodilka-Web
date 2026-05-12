/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {I18n} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import {SoundType} from '~/utils/SoundUtils';

export const getSoundLabels = (i18n: I18n): Record<SoundType, string> => ({
	[SoundType.Message]: i18n._(msg`Message Notifications`),
	[SoundType.Mute]: i18n._(msg`Voice Mute`),
	[SoundType.Unmute]: i18n._(msg`Voice Unmute`),
	[SoundType.Deaf]: i18n._(msg`Voice Deafen`),
	[SoundType.Undeaf]: i18n._(msg`Voice Undeafen`),
	[SoundType.UserJoin]: i18n._(msg`User Joins Channel`),
	[SoundType.UserLeave]: i18n._(msg`User Leaves Channel`),
	[SoundType.UserMove]: i18n._(msg`User Moved Channel`),
	[SoundType.ViewerJoin]: i18n._(msg`Viewer Joins Stream`),
	[SoundType.ViewerLeave]: i18n._(msg`Viewer Leaves Stream`),
	[SoundType.VoiceDisconnect]: i18n._(msg`Voice Disconnected`),
	[SoundType.IncomingRing]: i18n._(msg`Incoming Call`),
	[SoundType.CameraOn]: i18n._(msg`Camera On`),
	[SoundType.CameraOff]: i18n._(msg`Camera Off`),
	[SoundType.ScreenShareStart]: i18n._(msg`Screen Share Start`),
	[SoundType.ScreenShareStop]: i18n._(msg`Screen Share Stop`),
	[SoundType.PttActive]: i18n._(msg`Push-to-Talk Activate`),
	[SoundType.PttInactive]: i18n._(msg`Push-to-Talk Deactivate`),
});
