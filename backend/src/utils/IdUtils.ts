/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ChannelID, EmojiID, GuildID, RoleID, StickerID, UserID} from '~/BrandedTypes';

export function toIdString(
	value: GuildID | ChannelID | RoleID | UserID | EmojiID | StickerID | bigint | string | null | undefined,
): string | null {
	if (value === null || value === undefined) {
		return null;
	}

	return value.toString();
}

function toIdArray<T extends {toString(): string}>(values: Array<T> | Set<T> | null | undefined): Array<string> {
	if (!values) return [];
	return Array.from(values).map((v) => v.toString());
}

export function toSortedIdArray<T extends {toString(): string}>(
	values: Array<T> | Set<T> | null | undefined,
): Array<string> {
	return toIdArray(values).sort();
}
