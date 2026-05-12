/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Task} from '~/worker/TaskTypes';
import {createUserID} from '~/BrandedTypes';
import {Logger} from '~/Logger';
import {processUserDeletion} from '~/user/services/UserDeletionService';
import {CommonFields, validatePayload} from '../utils/TaskPayloadValidator';
import {getWorkerDependencies} from '../WorkerContext';

interface UserProcessPendingDeletionPayload {
	userId: string;
	deletionReasonCode: number;
}

const payloadSchema = {
	userId: CommonFields.userId(),
	deletionReasonCode: CommonFields.deletionReasonCode(),
};

const userProcessPendingDeletion: Task = async (payload, helpers) => {
	const validated = validatePayload<UserProcessPendingDeletionPayload>(payload, payloadSchema);
	helpers.logger.debug('Processing userProcessPendingDeletion task', {payload: validated});

	const userId = createUserID(BigInt(validated.userId));

	try {
		const deps = getWorkerDependencies();
		await processUserDeletion(userId, validated.deletionReasonCode, deps);
	} catch (error) {
		Logger.error({error, userId}, 'Failed to delete user account');
		throw error;
	}
};

export default userProcessPendingDeletion;
