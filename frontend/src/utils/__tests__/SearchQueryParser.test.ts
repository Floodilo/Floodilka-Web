/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import type {User} from '~/records/UserRecord';
import AuthenticationStore from '~/stores/AuthenticationStore';
import UserStore from '~/stores/UserStore';
import {parseQuery} from '~/utils/SearchQueryParser';

const CURRENT_USER_ID = 'current-user-id';
const CURRENT_USER: User = {
	id: CURRENT_USER_ID,
	username: 'currentuser',
	avatar: null,
	flags: 0,
};

describe('SearchQueryParser', () => {
	beforeEach(() => {
		AuthenticationStore.setUserId(CURRENT_USER_ID);
		UserStore.users = {};
		UserStore.cacheUsers([CURRENT_USER]);
	});

	afterEach(() => {
		AuthenticationStore.setUserId(null);
		UserStore.users = {};
	});

	it('resolves @me for from filters', () => {
		const params = parseQuery('from:@me');
		expect(params.authorId).toEqual([CURRENT_USER_ID]);
	});

	it('resolves @me for mentions filters regardless of case', () => {
		const params = parseQuery('mentions:@Me');
		expect(params.mentions).toEqual([CURRENT_USER_ID]);
	});

	it('resolves @me for exclude filters', () => {
		const params = parseQuery('-from:@me');
		expect(params.excludeAuthorId).toEqual([CURRENT_USER_ID]);
	});
});
