/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {mapUserToAdminResponse} from '~/admin/AdminModel';
import {createUserID} from '~/BrandedTypes';
import type {ICacheService} from '~/infrastructure/ICacheService';
import type {IUserRepository} from '~/user/IUserRepository';

interface LookupUserRequest {
	query: string;
}

interface AdminUserLookupServiceDeps {
	userRepository: IUserRepository;
	cacheService: ICacheService;
}

export class AdminUserLookupService {
	constructor(private readonly deps: AdminUserLookupServiceDeps) {}

	async lookupUser(data: LookupUserRequest) {
		const {userRepository, cacheService} = this.deps;
		let user = null;
		const query = data.query.trim();

		if (/^\d+$/.test(query)) {
			try {
				const userId = createUserID(BigInt(query));
				user = await userRepository.findUnique(userId);
			} catch {}
		} else if (/^\+\d{1,15}$/.test(query)) {
			user = await userRepository.findByPhone(query);
		} else if (query.includes('@')) {
			user = await userRepository.findByEmail(query);
		} else {
			user = await userRepository.findByCloudpaymentsSubscriptionId(query);
		}

		return {
			user: user ? await mapUserToAdminResponse(user, cacheService) : null,
		};
	}
}
