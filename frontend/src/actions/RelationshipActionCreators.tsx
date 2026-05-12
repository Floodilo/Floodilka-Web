/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {RelationshipTypes} from '~/Constants';
import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';

const logger = new Logger('RelationshipActionCreators');

export const sendFriendRequest = async (userId: string) => {
	try {
		await http.post({url: Endpoints.USER_RELATIONSHIP(userId)});
	} catch (error) {
		logger.error('Failed to send friend request:', error);
		throw error;
	}
};

export const sendFriendRequestByUsername = async (username: string) => {
	try {
		await http.post({url: Endpoints.USER_RELATIONSHIPS, body: {username}});
	} catch (error) {
		logger.error('Failed to send friend request by username:', error);
		throw error;
	}
};

export const acceptFriendRequest = async (userId: string) => {
	try {
		await http.put({url: Endpoints.USER_RELATIONSHIP(userId)});
	} catch (error) {
		logger.error('Failed to accept friend request:', error);
		throw error;
	}
};

export const removeRelationship = async (userId: string) => {
	try {
		await http.delete({url: Endpoints.USER_RELATIONSHIP(userId)});
	} catch (error) {
		logger.error('Failed to remove relationship:', error);
		throw error;
	}
};

export const blockUser = async (userId: string) => {
	try {
		await http.put({url: Endpoints.USER_RELATIONSHIP(userId), body: {type: RelationshipTypes.BLOCKED}});
	} catch (error) {
		logger.error('Failed to block user:', error);
		throw error;
	}
};

export const updateFriendNickname = async (userId: string, nickname: string | null) => {
	try {
		await http.patch({url: Endpoints.USER_RELATIONSHIP(userId), body: {nickname}});
	} catch (error) {
		logger.error('Failed to update friend nickname:', error);
		throw error;
	}
};
