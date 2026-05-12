/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import type {UserContactChangeLogRow} from '~/database/CassandraTypes';
import type {User} from '~/Models';
import type {UserContactChangeLogRepository} from '../repositories/UserContactChangeLogRepository';

export type ContactChangeReason = 'user_requested' | 'admin_action';

interface RecordDiffParams {
	oldUser: User | null;
	newUser: User;
	reason: ContactChangeReason;
	actorUserId: UserID | null;
	eventAt?: Date;
}

interface ListLogsParams {
	userId: UserID;
	limit?: number;
	beforeEventId?: string;
}

export class UserContactChangeLogService {
	private readonly DEFAULT_LIMIT = 50;

	constructor(private readonly repo: UserContactChangeLogRepository) {}

	async recordDiff(params: RecordDiffParams): Promise<void> {
		const {oldUser, newUser, reason, actorUserId, eventAt} = params;
		const tasks: Array<Promise<void>> = [];

		const oldEmail = oldUser?.email?.toLowerCase() ?? null;
		const newEmail = newUser.email?.toLowerCase() ?? null;
		if (oldEmail !== newEmail) {
			tasks.push(
				this.repo.insertLog({
					userId: newUser.id,
					field: 'email',
					oldValue: oldEmail,
					newValue: newEmail,
					reason,
					actorUserId,
					eventAt,
				}),
			);
		}

		const oldPhone = oldUser?.phone ?? null;
		const newPhone = newUser.phone ?? null;
		if (oldPhone !== newPhone) {
			tasks.push(
				this.repo.insertLog({
					userId: newUser.id,
					field: 'phone',
					oldValue: oldPhone,
					newValue: newPhone,
					reason,
					actorUserId,
					eventAt,
				}),
			);
		}

		const oldUsername = oldUser?.username ?? null;
		const newUsername = newUser.username ?? null;
		if (oldUsername !== newUsername) {
			tasks.push(
				this.repo.insertLog({
					userId: newUser.id,
					field: 'username',
					oldValue: oldUsername,
					newValue: newUsername,
					reason,
					actorUserId,
					eventAt,
				}),
			);
		}

		if (tasks.length > 0) {
			await Promise.all(tasks);
		}
	}

	async listLogs(params: ListLogsParams): Promise<Array<UserContactChangeLogRow>> {
		const {userId, beforeEventId} = params;
		const limit = params.limit ?? this.DEFAULT_LIMIT;
		return this.repo.listLogs({userId, limit, beforeEventId});
	}

}
