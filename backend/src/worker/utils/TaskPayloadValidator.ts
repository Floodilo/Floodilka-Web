/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

type FieldRequirement = 'required' | 'optional';

interface FieldValidator {
	type: 'string' | 'number' | 'boolean' | 'object' | 'array';
	requirement: FieldRequirement;
	min?: number;
	max?: number;
	validator?: (value: unknown) => boolean;
}

interface TaskPayloadSchema {
	[key: string]: FieldValidator;
}

class PayloadValidationError extends Error {
	constructor(
		public readonly field: string,
		message: string,
	) {
		super(`Invalid payload: ${field} - ${message}`);
		this.name = 'PayloadValidationError';
	}
}

function validateField(field: string, value: unknown, validator: FieldValidator): void {
	if (value === undefined || value === null) {
		if (validator.requirement === 'required') {
			throw new PayloadValidationError(field, 'is required');
		}
		return;
	}

	const actualType = Array.isArray(value) ? 'array' : typeof value;
	if (actualType !== validator.type) {
		throw new PayloadValidationError(field, `must be ${validator.type}, got ${actualType}`);
	}

	if (validator.type === 'number' && typeof value === 'number') {
		if (validator.min !== undefined && value < validator.min) {
			throw new PayloadValidationError(field, `must be at least ${validator.min}`);
		}
		if (validator.max !== undefined && value > validator.max) {
			throw new PayloadValidationError(field, `must be at most ${validator.max}`);
		}
	}

	if (validator.validator && !validator.validator(value)) {
		throw new PayloadValidationError(field, 'failed custom validation');
	}
}

export function validatePayload<T>(payload: unknown, schema: TaskPayloadSchema): T {
	if (typeof payload !== 'object' || payload === null) {
		throw new PayloadValidationError('payload', 'must be an object');
	}

	const data = payload as Record<string, unknown>;

	for (const [field, validator] of Object.entries(schema)) {
		validateField(field, data[field], validator);
	}

	return payload as T;
}

export const CommonFields = {
	userId: (requirement: FieldRequirement = 'required'): FieldValidator => ({
		type: 'string',
		requirement,
	}),

	guildId: (requirement: FieldRequirement = 'required'): FieldValidator => ({
		type: 'string',
		requirement,
	}),

	channelId: (requirement: FieldRequirement = 'required'): FieldValidator => ({
		type: 'string',
		requirement,
	}),

	messageId: (requirement: FieldRequirement = 'required'): FieldValidator => ({
		type: 'string',
		requirement,
	}),

	timestamp: (requirement: FieldRequirement = 'optional'): FieldValidator => ({
		type: 'number',
		requirement,
	}),

	days: (requirement: FieldRequirement = 'required', min = 0, max = 7): FieldValidator => ({
		type: 'number',
		requirement,
		min,
		max,
	}),

	limit: (requirement: FieldRequirement = 'optional', max = 1000): FieldValidator => ({
		type: 'number',
		requirement,
		min: 1,
		max,
	}),

	deletionReasonCode: (requirement: FieldRequirement = 'required'): FieldValidator => ({
		type: 'number',
		requirement,
	}),

	boolean: (requirement: FieldRequirement = 'optional'): FieldValidator => ({
		type: 'boolean',
		requirement,
	}),

	stringArray: (requirement: FieldRequirement = 'optional'): FieldValidator => ({
		type: 'array',
		requirement,
		validator: (value) => Array.isArray(value) && value.every((v) => typeof v === 'string'),
	}),
};
