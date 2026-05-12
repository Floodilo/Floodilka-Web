/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import MemberSearchStore from '~/stores/MemberSearchStore';
import MessageStore from '~/stores/MessageStore';
import QuickSwitcherStore from '~/stores/QuickSwitcherStore';
import RelationshipStore from '~/stores/RelationshipStore';
import type {GatewayHandlerContext} from '../index';

interface RelationshipRemovePayload {
	id: string;
}

export function handleRelationshipRemove(data: RelationshipRemovePayload, _context: GatewayHandlerContext): void {
	RelationshipStore.removeRelationship(data.id);
	MemberSearchStore.handleFriendshipChange(data.id, false);
	MessageStore.handleRelationshipUpdate();
	QuickSwitcherStore.recomputeIfOpen();
}
