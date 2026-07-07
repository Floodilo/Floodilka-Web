/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('~/Logger', () => ({Logger: {info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn()}}));

import type {ICacheService} from '~/infrastructure/ICacheService';
import {MockSMSService} from '~/infrastructure/MockSMSService';

class InMemoryCacheService implements Partial<ICacheService> {
	private store = new Map<string, unknown>();

	async get<T>(key: string): Promise<T | null> {
		return (this.store.get(key) as T) ?? null;
	}

	async set<T>(key: string, value: T): Promise<void> {
		this.store.set(key, value);
	}

	async delete(key: string): Promise<void> {
		this.store.delete(key);
	}

	async ttl(): Promise<number> {
		return 600;
	}
}

const PHONE = '+79991234567';

describe('MockSMSService', () => {
	let service: MockSMSService;

	beforeEach(() => {
		service = new MockSMSService(new InMemoryCacheService() as unknown as ICacheService);
	});

	it('accepts the generated code exactly once', async () => {
		await service.startVerification(PHONE);
		const [record] = service.listSentCodes();
		expect(record.phone).toBe(PHONE);
		expect(record.code).toMatch(/^\d{6}$/);

		expect(await service.checkVerification(PHONE, record.code)).toBe(true);
		expect(await service.checkVerification(PHONE, record.code)).toBe(false);
	});

	it('rejects a wrong code and still accepts the right one', async () => {
		await service.startVerification(PHONE);
		const [record] = service.listSentCodes();

		expect(await service.checkVerification(PHONE, '000000')).toBe(false);
		expect(await service.checkVerification(PHONE, record.code)).toBe(true);
	});

	it('rejects when no verification was started', async () => {
		expect(await service.checkVerification(PHONE, '123456')).toBe(false);
	});

	it('locks out after too many wrong attempts', async () => {
		await service.startVerification(PHONE);
		const [record] = service.listSentCodes();

		for (let i = 0; i < 5; i++) {
			expect(await service.checkVerification(PHONE, '000000')).toBe(false);
		}

		expect(await service.checkVerification(PHONE, record.code)).toBe(false);
	});

	it('replaces the code on a new verification for the same phone', async () => {
		await service.startVerification(PHONE);
		const [first] = service.listSentCodes();
		await service.startVerification(PHONE);
		const second = service.listSentCodes()[1];

		if (first.code !== second.code) {
			expect(await service.checkVerification(PHONE, first.code)).toBe(false);
		}
		expect(await service.checkVerification(PHONE, second.code)).toBe(true);
	});

	it('lists and clears sent codes for the test harness', async () => {
		await service.startVerification(PHONE);
		await service.startVerification('+79997654321');
		expect(service.listSentCodes()).toHaveLength(2);

		service.clearSentCodes();
		expect(service.listSentCodes()).toHaveLength(0);
	});
});
