/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import UserNoteStore from '~/stores/UserNoteStore';
import type {GatewayHandlerContext} from '../index';

interface UserNoteUpdatePayload {
	id: string;
	note?: string | null;
}

export function handleUserNoteUpdate(data: UserNoteUpdatePayload, _context: GatewayHandlerContext): void {
	UserNoteStore.updateUserNote(data.id, data.note ?? '');
}
