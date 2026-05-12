/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {
	atNextMillisecond as atNextMillisecondImpl,
	atPreviousMillisecond as atPreviousMillisecondImpl,
	compare as compareImpl,
	extractTimestamp as extractTimestampImpl,
	fromTimestamp as fromTimestampImpl,
	fromTimestampWithSequence as fromTimestampWithSequenceImpl,
	isProbablyAValidSnowflake as isProbablyAValidSnowflakeImpl,
	type SnowflakeSequence,
} from './SnowflakeUtils';

function cast<T>(value: T): T {
	return value;
}

const SnowflakeUtil = {
	extractTimestamp(snowflake: string): number {
		return extractTimestampImpl(snowflake);
	},

	compare(snowflake1: string | null, snowflake2: string | null): number {
		return compareImpl(snowflake1, snowflake2);
	},

	atPreviousMillisecond(snowflake: string): string {
		return atPreviousMillisecondImpl(snowflake);
	},

	atNextMillisecond(snowflake: string): string {
		return atNextMillisecondImpl(snowflake);
	},

	fromTimestamp(timestamp: number): string {
		return fromTimestampImpl(timestamp);
	},

	fromTimestampWithSequence(timestamp: number, sequence: SnowflakeSequence): string {
		return fromTimestampWithSequenceImpl(timestamp, sequence);
	},

	isProbablyAValidSnowflake(value: string | null | undefined): boolean {
		return isProbablyAValidSnowflakeImpl(value);
	},

	castChannelIdAsMessageId(channelId: string): string {
		return cast(channelId);
	},

	castMessageIdAsChannelId(messageId: string): string {
		return cast(messageId);
	},

	castGuildIdAsEveryoneGuildRoleId(guildId: string): string {
		return cast(guildId);
	},

	cast,
};

export default SnowflakeUtil;
