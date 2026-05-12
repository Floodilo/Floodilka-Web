/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {MessageRecord} from '~/records/MessageRecord';
import type {SearchSegment} from '~/utils/SearchSegmentManager';

export interface SearchMachineStateIdle {
	status: 'idle';
}

export interface SearchMachineStateLoading {
	status: 'loading';
}

export interface SearchMachineStateIndexing {
	status: 'indexing';
	pollCount: number;
}

export interface SearchMachineStateSuccess {
	status: 'success';
	results: Array<MessageRecord>;
	total: number;
	hitsPerPage: number;
	page: number;
}

export interface SearchMachineStateError {
	status: 'error';
	error: string;
}

export type SearchMachineState =
	| SearchMachineStateIdle
	| SearchMachineStateLoading
	| SearchMachineStateIndexing
	| SearchMachineStateSuccess
	| SearchMachineStateError;

export const cloneMessageRecord = (message: MessageRecord): MessageRecord => {
	return new MessageRecord(message.toJSON(), {skipUserCache: true});
};

export const cloneMessageResults = (messages: Array<MessageRecord>): Array<MessageRecord> => {
	return messages.map(cloneMessageRecord);
};

export const cloneMachineState = (machineState: SearchMachineState): SearchMachineState => {
	if (machineState.status !== 'success') {
		return machineState;
	}

	return {
		...machineState,
		results: cloneMessageResults(machineState.results),
	};
};

export const areSegmentsEqual = (current: Array<SearchSegment>, next: Array<SearchSegment>): boolean => {
	if (current.length !== next.length) {
		return false;
	}

	for (let index = 0; index < current.length; index += 1) {
		const a = current[index];
		const b = next[index];

		if (
			a.type !== b.type ||
			a.filterKey !== b.filterKey ||
			a.id !== b.id ||
			a.displayText !== b.displayText ||
			a.start !== b.start ||
			a.end !== b.end
		) {
			return false;
		}
	}

	return true;
};
