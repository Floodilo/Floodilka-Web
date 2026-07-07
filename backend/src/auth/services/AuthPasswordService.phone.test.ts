/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {beforeEach, describe, expect, it, vi} from 'vitest';

vi.mock('~/Config', () => ({Config: {}}));
vi.mock('~/Logger', () => ({Logger: {info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn()}}));

import type {ICacheService} from '~/infrastructure/ICacheService';
import {MockSMSService} from '~/infrastructure/MockSMSService';
import {AuthPasswordService} from '~/auth/services/AuthPasswordService';
import type {IUserRepository} from '~/user/IUserRepository';

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
const USER_ID = 42n;

const makeRequest = () => new Request('http://localhost/auth/forgot', {headers: {'x-forwarded-for': '10.1.2.3'}});

describe('AuthPasswordService phone reset flow', () => {
	let cache: InMemoryCacheService;
	let sms: MockSMSService;
	let service: AuthPasswordService;
	let createdResetTokens: Array<{token_: string; user_id: bigint; email: string}>;
	let phoneUser: {id: bigint; email: string | null; username: string; locale: string} | null;

	beforeEach(() => {
		cache = new InMemoryCacheService();
		sms = new MockSMSService(cache as unknown as ICacheService);
		createdResetTokens = [];
		phoneUser = {id: USER_ID, email: null, username: 'phoneuser', locale: 'ru'};

		const repository = {
			findByPhone: vi.fn(async (phone: string) => (phone === PHONE ? phoneUser : null)),
			createPasswordResetToken: vi.fn(async (row: {token_: string; user_id: bigint; email: string}) => {
				createdResetTokens.push(row);
			}),
		} as unknown as IUserRepository;

		const rateLimitService = {
			checkLimit: vi.fn(async () => ({allowed: true, resetTime: new Date(Date.now() + 60_000)})),
			peekLimit: vi.fn(async () => ({allowed: true})),
			resetLimit: vi.fn(async () => {}),
		};

		service = new AuthPasswordService(
			repository,
			{sendPasswordResetCode: vi.fn(async () => true)} as never,
			sms,
			{hasValidDnsRecords: vi.fn(async () => true)} as never,
			rateLimitService as never,
			cache as unknown as ICacheService,
			async () => 'a'.repeat(64),
			async (user) => user as never,
			() => {},
			vi.fn() as never,
			vi.fn() as never,
		);
	});

	it('sends an SMS code and issues a reset token for the right code', async () => {
		await service.forgotPassword({data: {phone: PHONE}, request: makeRequest()});

		const sent = sms.listSentCodes();
		expect(sent).toHaveLength(1);
		expect(sent[0].phone).toBe(PHONE);

		const {resetToken} = await service.verifyResetCode({data: {phone: PHONE, code: sent[0].code}});
		expect(resetToken).toBe('a'.repeat(64));
		expect(createdResetTokens).toHaveLength(1);
		expect(createdResetTokens[0].user_id).toBe(USER_ID);
	});

	it('rejects a wrong SMS code', async () => {
		await service.forgotPassword({data: {phone: PHONE}, request: makeRequest()});

		await expect(service.verifyResetCode({data: {phone: PHONE, code: '000000'}})).rejects.toThrow();
		expect(createdResetTokens).toHaveLength(0);
	});

	it('does not reveal whether a phone exists', async () => {
		phoneUser = null;

		await expect(service.forgotPassword({data: {phone: PHONE}, request: makeRequest()})).resolves.toBeUndefined();
		expect(sms.listSentCodes()).toHaveLength(0);
	});

	it('locks out after five wrong attempts even with the right code afterwards', async () => {
		await service.forgotPassword({data: {phone: PHONE}, request: makeRequest()});
		const [sent] = sms.listSentCodes();

		for (let i = 0; i < 5; i++) {
			await expect(service.verifyResetCode({data: {phone: PHONE, code: '000000'}})).rejects.toThrow();
		}

		await expect(service.verifyResetCode({data: {phone: PHONE, code: sent.code}})).rejects.toThrow();
		expect(createdResetTokens).toHaveLength(0);
	});
});
