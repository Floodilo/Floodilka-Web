/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {Task} from '~/worker/TaskTypes';
import {getMetricsService} from '~/infrastructure/MetricsService';
import {Logger} from '~/Logger';
import {getWorkerDependencies} from '../WorkerContext';

const RETENTION_WINDOWS: Array<[string, number]> = [
	['d1', 1],
	['d7', 7],
	['d30', 30],
];

const calculateRetention: Task = async (_payload, _helpers) => {
	const {redis} = getWorkerDependencies();
	const metrics = getMetricsService();
	const today = new Date().toISOString().slice(0, 10);

	for (const [window, days] of RETENTION_WINDOWS) {
		try {
			const cohortDate = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
			const cohortKey = `registrations:${cohortDate}`;
			const cohortUsers = await redis.smembers(cohortKey);

			if (cohortUsers.length === 0) {
				continue;
			}

			const pipeline = redis.pipeline();
			for (const userId of cohortUsers) {
				pipeline.exists(`dau:${today}:${userId}`);
			}
			const results = await pipeline.exec();
			if (!results) {
				Logger.warn({window, cohortDate}, 'Retention pipeline returned null');
				continue;
			}

			const activeCount = results.filter(([err, val]) => !err && val === 1).length;
			const rate = (activeCount / cohortUsers.length) * 100;

			metrics.gauge({
				name: 'retention.rate',
				dimensions: {window, cohort_date: cohortDate},
				value: Math.round(rate * 10) / 10,
			});
			metrics.gauge({
				name: 'retention.cohort_size',
				dimensions: {window, cohort_date: cohortDate},
				value: cohortUsers.length,
			});
			metrics.gauge({
				name: 'retention.active_count',
				dimensions: {window, cohort_date: cohortDate},
				value: activeCount,
			});

			Logger.info(
				{window, cohortDate, cohortSize: cohortUsers.length, activeCount, rate: Math.round(rate * 10) / 10},
				'Retention calculated',
			);
		} catch (error) {
			Logger.error({error, window}, 'Failed to calculate retention for window');
		}
	}
};

export default calculateRetention;
