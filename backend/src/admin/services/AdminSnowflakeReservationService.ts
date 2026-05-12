/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import {SNOWFLAKE_RESERVATION_REFRESH_CHANNEL} from '~/constants/InstanceConfig';
import {InputValidationError} from '~/Errors';
import type {ICacheService} from '~/infrastructure/ICacheService';
import type {SnowflakeReservationRepository} from '~/instance/SnowflakeReservationRepository';
import type {AdminAuditService} from './AdminAuditService';

interface AdminSnowflakeReservationServiceDeps {
	repository: SnowflakeReservationRepository;
	cacheService: ICacheService;
	auditService: AdminAuditService;
}

export class AdminSnowflakeReservationService {
	constructor(private readonly deps: AdminSnowflakeReservationServiceDeps) {}

	async listReservations() {
		const {repository} = this.deps;
		const entries = await repository.listReservations();
		return entries.map((entry) => ({
			email: entry.emailKey,
			snowflake: entry.snowflake.toString(),
			updated_at: entry.updatedAt ? entry.updatedAt.toISOString() : null,
		}));
	}

	async setReservation(data: {email: string; snowflake: string}, adminUserId: UserID, auditLogReason: string | null) {
		const {repository, cacheService, auditService} = this.deps;
		const emailLower = data.email.toLowerCase();

		if (!emailLower) {
			throw InputValidationError.create('email', 'Недействительный адрес электронной почты');
		}

		let snowflakeValue: bigint;
		try {
			snowflakeValue = BigInt(data.snowflake);
		} catch {
			throw InputValidationError.create('snowflake', 'Недопустимый snowflake');
		}

		await repository.setReservation(emailLower, snowflakeValue);
		await cacheService.publish(SNOWFLAKE_RESERVATION_REFRESH_CHANNEL, 'refresh');

		await auditService.createAuditLog({
			adminUserId,
			targetType: 'snowflake_reservation',
			targetId: BigInt(0),
			action: 'set_snowflake_reservation',
			auditLogReason,
			metadata: new Map([
				['email', emailLower],
				['snowflake', snowflakeValue.toString()],
			]),
		});
	}

	async deleteReservation(data: {email: string}, adminUserId: UserID, auditLogReason: string | null) {
		const {repository, cacheService, auditService} = this.deps;
		const emailLower = data.email.toLowerCase();

		if (!emailLower) {
			throw InputValidationError.create('email', 'Недействительный адрес электронной почты');
		}

		await repository.deleteReservation(emailLower);
		await cacheService.publish(SNOWFLAKE_RESERVATION_REFRESH_CHANNEL, 'refresh');

		await auditService.createAuditLog({
			adminUserId,
			targetType: 'snowflake_reservation',
			targetId: BigInt(0),
			action: 'delete_snowflake_reservation',
			auditLogReason,
			metadata: new Map([['email', emailLower]]),
		});
	}
}
