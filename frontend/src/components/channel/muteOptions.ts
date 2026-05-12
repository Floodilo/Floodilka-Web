/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageDescriptor} from '@lingui/core';
import {msg} from '@lingui/core/macro';

export interface MuteDurationOption {
	label: string;
	value: number | null;
}

interface MuteDurationOptionDescriptor {
	label: MessageDescriptor;
	value: number | null;
}

const MUTE_DURATION_OPTIONS_DESCRIPTORS: Array<MuteDurationOptionDescriptor> = [
	{label: msg`For 15 Minutes`, value: 15 * 60 * 1000},
	{label: msg`For 1 Hour`, value: 60 * 60 * 1000},
	{label: msg`For 3 Hours`, value: 3 * 60 * 60 * 1000},
	{label: msg`For 8 Hours`, value: 8 * 60 * 60 * 1000},
	{label: msg`For 24 Hours`, value: 24 * 60 * 60 * 1000},
	{label: msg`Until I turn it back on`, value: null},
];

export const getMuteDurationOptions = (t: (msg: MessageDescriptor) => string): Array<MuteDurationOption> => {
	return MUTE_DURATION_OPTIONS_DESCRIPTORS.map((opt) => ({
		...opt,
		label: t(opt.label),
	}));
};

export const createMuteConfig = (value: number | null) =>
	value == null
		? null
		: {
				selected_time_window: value,
				end_time: new Date(Date.now() + value).toISOString(),
			};
