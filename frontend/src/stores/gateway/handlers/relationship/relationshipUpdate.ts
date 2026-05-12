/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {RelationshipTypes} from '~/Constants';
import type {Relationship} from '~/records/RelationshipRecord';
import MemberSearchStore from '~/stores/MemberSearchStore';
import MessageStore from '~/stores/MessageStore';
import NotificationStore from '~/stores/NotificationStore';
import QuickSwitcherStore from '~/stores/QuickSwitcherStore';
import RelationshipStore from '~/stores/RelationshipStore';
import type {GatewayHandlerContext} from '../index';

interface RelationshipPayload {
	id: string;
	type: number;
}

export function handleRelationshipUpdate(data: RelationshipPayload, _context: GatewayHandlerContext): void {
	RelationshipStore.updateRelationship(data as Relationship);
	MemberSearchStore.handleFriendshipChange(data.id, data.type === RelationshipTypes.FRIEND);
	MessageStore.handleRelationshipUpdate();
	QuickSwitcherStore.recomputeIfOpen();
	NotificationStore.handleRelationshipNotification(data as Relationship);
}
