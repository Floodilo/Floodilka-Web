/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createUserID, type UserID} from '~/BrandedTypes';
import {fetchMany, upsertOne} from '~/database/Cassandra';
import type {UserContactChangeLogRow} from '~/database/CassandraTypes';
import {UserContactChangeLogs} from '~/Tables';

const createListLogsCql = (limit: number, includeCursor: boolean) =>
	UserContactChangeLogs.selectCql({
		where: includeCursor
			? [UserContactChangeLogs.where.eq('user_id'), UserContactChangeLogs.where.lt('event_id', 'before_event_id')]
			: UserContactChangeLogs.where.eq('user_id'),
		orderBy: {col: 'event_id', direction: 'DESC'},
		limit,
	});

export interface ContactChangeLogListParams {
	userId: UserID;
	limit: number;
	beforeEventId?: string;
}

export interface ContactChangeLogInsertParams {
	userId: UserID;
	field: string;
	oldValue: string | null;
	newValue: string | null;
	reason: string;
	actorUserId: UserID | null;
	eventAt?: Date;
}

export class UserContactChangeLogRepository {
	async insertLog(params: ContactChangeLogInsertParams): Promise<void> {
		const eventAt = params.eventAt ?? new Date();
		await upsertOne(
			UserContactChangeLogs.insertWithNow(
				{
					user_id: params.userId,
					field: params.field,
					old_value: params.oldValue,
					new_value: params.newValue,
					reason: params.reason,
					actor_user_id: params.actorUserId,
					event_at: eventAt,
				},
				'event_id',
			),
		);
	}

	async listLogs(params: ContactChangeLogListParams): Promise<Array<UserContactChangeLogRow>> {
		const {userId, limit, beforeEventId} = params;
		const query = createListLogsCql(limit, !!beforeEventId);
		const queryParams: {user_id: UserID; before_event_id?: string} = {
			user_id: userId,
		};
		if (beforeEventId) {
			queryParams.before_event_id = beforeEventId;
		}
		const rows = await fetchMany<
			Omit<UserContactChangeLogRow, 'user_id' | 'actor_user_id'> & {
				user_id: bigint;
				actor_user_id: bigint | null;
			}
		>(query, queryParams);
		return rows.map((row) => ({
			...row,
			user_id: createUserID(row.user_id),
			actor_user_id: row.actor_user_id != null ? createUserID(row.actor_user_id) : null,
		}));
	}
}
