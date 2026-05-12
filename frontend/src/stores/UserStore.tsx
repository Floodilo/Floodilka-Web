/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {action, makeAutoObservable, reaction, runInAction} from 'mobx';
import {openClaimAccountModal} from '~/components/modals/ClaimAccountModal';
import {type User, type UserPrivate, UserRecord} from '~/records/UserRecord';
import AuthenticationStore from '~/stores/AuthenticationStore';

class UserStore {
	users: Record<string, UserRecord> = {};

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
	}

	get currentUser(): UserRecord | null {
		const currentUserId = AuthenticationStore.userId;
		if (!currentUserId) {
			return null;
		}
		return this.users[currentUserId] ?? null;
	}

	get currentUserId(): string | null {
		return AuthenticationStore.userId;
	}

	get usersList(): ReadonlyArray<UserRecord> {
		return Object.values(this.users);
	}

	getUser(userId: string): UserRecord | undefined {
		return this.users[userId];
	}

	getCurrentUser(): UserRecord | undefined {
		return this.currentUser ?? undefined;
	}

	getUserByTag(tag: string): UserRecord | undefined {
		return this.usersList.find((user) => user.tag === tag);
	}

	getUsers(): ReadonlyArray<UserRecord> {
		return this.usersList;
	}

	@action
	handleConnectionOpen(currentUser: UserPrivate): void {
		const userRecord = new UserRecord(currentUser);

		this.users = {
			[currentUser.id]: userRecord,
		};

		if (!userRecord.isClaimed()) {
			setTimeout(async () => {
				openClaimAccountModal();
			}, 1000);
		}
	}

	@action
	handleUserUpdate(user: User): void {
		const existingUser = this.users[user.id];
		const updatedUser = existingUser ? existingUser.withUpdates(user) : new UserRecord(user);
		this.users = {
			...this.users,
			[user.id]: updatedUser,
		};
	}

	cacheUsers(users: Array<User & {globalName?: never}>): void {
		const updatedUsers = {...this.users};
		for (const user of users) {
			const existingUser = updatedUsers[user.id];
			if (existingUser) {
				updatedUsers[user.id] = existingUser.withUpdates(user);
			} else {
				updatedUsers[user.id] = new UserRecord(user);
			}
		}
		runInAction(() => {
			this.users = updatedUsers;
		});
	}

	subscribe(callback: () => void): () => void {
		return reaction(
			() => this.usersList.length,
			() => callback(),
			{fireImmediately: true},
		);
	}
}

export default new UserStore();
