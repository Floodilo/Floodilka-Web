/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {ChannelTypes} from '~/Constants';
import {ComponentDispatch} from '~/lib/ComponentDispatch';
import {Logger} from '~/lib/Logger';
import {type Channel, ChannelRecord} from '~/records/ChannelRecord';
import {type UserPartial, UserRecord} from '~/records/UserRecord';
import DeveloperOptionsStore, {type DeveloperOptionsState} from '~/stores/DeveloperOptionsStore';
import MockIncomingCallStore from '~/stores/MockIncomingCallStore';
import UserStore from '~/stores/UserStore';

const logger = new Logger('DeveloperOptions');

export const updateOption = <K extends keyof DeveloperOptionsState>(key: K, value: DeveloperOptionsState[K]): void => {
	logger.debug(`Updating developer option: ${String(key)} = ${value}`);
	DeveloperOptionsStore.updateOption(key, value);
};

export function setAttachmentMock(
	attachmentId: string,
	mock: DeveloperOptionsState['mockAttachmentStates'][string] | null,
): void {
	const next = {...DeveloperOptionsStore.mockAttachmentStates};
	if (mock === null) {
		delete next[attachmentId];
	} else {
		next[attachmentId] = mock;
	}
	updateOption('mockAttachmentStates', next);
	ComponentDispatch.dispatch('LAYOUT_RESIZED');
}

export function clearAllAttachmentMocks(): void {
	updateOption('mockAttachmentStates', {});
	ComponentDispatch.dispatch('LAYOUT_RESIZED');
}

export function triggerMockIncomingCall(): void {
	const currentUser = UserStore.getCurrentUser();
	if (!currentUser) {
		logger.warn('Cannot trigger mock incoming call: No current user');
		return;
	}

	const timestamp = Date.now() - 1420070400000;
	const random = Math.floor(Math.random() * 4096);
	const mockChannelId = ((timestamp << 22) | random).toString();

	const initiatorPartial: UserPartial = {
		id: currentUser.id,
		username: currentUser.username,
		avatar: currentUser.avatar ?? null,
		flags: currentUser.flags ?? 0,
	};

	const channelData: Channel = {
		id: mockChannelId,
		type: ChannelTypes.DM,
		recipients: [initiatorPartial],
	};

	const channelRecord = new ChannelRecord(channelData);
	const initiatorRecord = new UserRecord(initiatorPartial);

	MockIncomingCallStore.setMockCall({
		channel: channelRecord,
		initiator: initiatorRecord,
	});

	logger.info(`Triggered mock incoming call from user ${currentUser.username}`);
}
