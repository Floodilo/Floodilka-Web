/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageRecord} from '~/records/MessageRecord';

export interface BaseMediaProps {
	channelId?: string;
	messageId?: string;
	attachmentId?: string;
	embedIndex?: number;
	nsfw?: boolean;
	message?: MessageRecord;
	contentHash?: string | null;
	onDelete?: (bypassConfirm?: boolean) => void;
}
