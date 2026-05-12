/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {GatewayCustomStatusPayload} from '~/lib/customStatus';
import type {GuildMember} from '~/records/GuildMemberRecord';
import type {User} from '~/records/UserRecord';
import GuildMemberStore from '~/stores/GuildMemberStore';
import MemberSidebarStore from '~/stores/MemberSidebarStore';
import UserStore from '~/stores/UserStore';
import type {GatewayHandlerContext} from '../index';

interface MemberListGroup {
	id: string;
	count: number;
}

interface MemberListPresence {
	status?: string;
	custom_status?: GatewayCustomStatusPayload | null;
}

interface MemberListItem {
	member?: GuildMember & {presence?: MemberListPresence | null};
	group?: MemberListGroup;
}

interface MemberListOperation {
	op: 'SYNC' | 'INSERT' | 'UPDATE' | 'DELETE' | 'INVALIDATE';
	range?: [number, number];
	items?: ReadonlyArray<MemberListItem>;
	index?: number;
	item?: MemberListItem;
}

interface GuildMemberListUpdatePayload {
	guild_id: string;
	id: string;
	channel_id?: string;
	member_count: number;
	online_count: number;
	groups: ReadonlyArray<MemberListGroup>;
	ops: ReadonlyArray<MemberListOperation>;
}

const MAX_VALID_INDEX = 100000;

function isValidRange(range: [number, number] | undefined): range is [number, number] {
	if (!range || !Array.isArray(range) || range.length !== 2) {
		return false;
	}
	const [start, end] = range;
	return typeof start === 'number' && typeof end === 'number' && start >= 0 && end >= start && end <= MAX_VALID_INDEX;
}

function isValidIndex(index: number | undefined): index is number {
	return typeof index === 'number' && index >= 0 && index <= MAX_VALID_INDEX;
}

function processMemberItem(guildId: string, item: MemberListItem): void {
	if (item.group) {
		return;
	}
	if (!item.member?.user?.id) {
		return;
	}
	UserStore.handleUserUpdate(item.member.user as User);
	GuildMemberStore.handleMemberAdd(guildId, item.member);
}

export function handleGuildMemberListUpdate(data: GuildMemberListUpdatePayload, _context: GatewayHandlerContext): void {
	const {
		guild_id: guildId,
		id: listId,
		channel_id: channelId,
		member_count: memberCount,
		online_count: onlineCount,
		groups,
		ops,
	} = data;

	if (!guildId || !listId || !Array.isArray(ops)) {
		return;
	}

	const validOps: Array<{
		op: 'SYNC' | 'INSERT' | 'UPDATE' | 'DELETE' | 'INVALIDATE';
		range?: [number, number];
		items?: Array<{
			member?: {
				user: {id: string};
				presence?: MemberListPresence | null;
			};
			group?: MemberListGroup;
		}>;
		index?: number;
		item?: {
			member?: {
				user: {id: string};
				presence?: MemberListPresence | null;
			};
			group?: MemberListGroup;
		};
	}> = [];

	for (const op of ops) {
		switch (op.op) {
			case 'SYNC': {
				if (isValidRange(op.range) && op.items) {
					for (const item of op.items) {
						processMemberItem(guildId, item);
					}
					validOps.push({
						op: op.op,
						range: op.range,
						items: op.items.map((item: MemberListItem) => ({
							member: item.member
								? {
										user: item.member.user,
										presence: item.member.presence ?? undefined,
									}
								: undefined,
							group: item.group,
						})),
					});
				}
				break;
			}
			case 'INSERT':
			case 'UPDATE': {
				if (isValidIndex(op.index) && op.item) {
					processMemberItem(guildId, op.item);
					validOps.push({
						op: op.op,
						index: op.index,
						item: {
							member: op.item.member
								? {
										user: op.item.member.user,
										presence: op.item.member.presence ?? undefined,
									}
								: undefined,
							group: op.item.group,
						},
					});
				}
				break;
			}
			case 'DELETE': {
				if (isValidIndex(op.index)) {
					validOps.push({
						op: op.op,
						index: op.index,
					});
				}
				break;
			}
			case 'INVALIDATE': {
				if (isValidRange(op.range)) {
					validOps.push({
						op: op.op,
						range: op.range,
					});
				}
				break;
			}
		}
	}

	if (validOps.length === 0 && ops.length > 0) {
		return;
	}

	const safeGroups = Array.isArray(groups) ? Array.from(groups) : [];

	MemberSidebarStore.handleListUpdate({
		guildId,
		listId,
		channelId,
		memberCount,
		onlineCount,
		groups: safeGroups,
		ops: validOps,
	});
}
