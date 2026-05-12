/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageDescriptor} from '@lingui/core';
import {msg} from '@lingui/core/macro';

export interface TimeoutDurationOption {
	value: number;
	label: string;
}

interface TimeoutDurationOptionDescriptor {
	value: number;
	label: MessageDescriptor;
}

const TIMEOUT_DURATION_OPTIONS_DESCRIPTORS: ReadonlyArray<TimeoutDurationOptionDescriptor> = [
	{value: 60, label: msg`60 seconds`},
	{value: 5 * 60, label: msg`5 minutes`},
	{value: 10 * 60, label: msg`10 minutes`},
	{value: 60 * 60, label: msg`1 hour`},
	{value: 60 * 60 * 24, label: msg`1 day`},
	{value: 60 * 60 * 24 * 7, label: msg`1 week`},
];

export const getTimeoutDurationOptions = (
	t: (msg: MessageDescriptor) => string,
): ReadonlyArray<TimeoutDurationOption> => {
	return TIMEOUT_DURATION_OPTIONS_DESCRIPTORS.map((opt) => ({
		...opt,
		label: t(opt.label),
	}));
};
