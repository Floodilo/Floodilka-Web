/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, observable, runInAction} from 'mobx';
import type {Gift} from '~/actions/GiftActionCreators';
import * as GiftActionCreators from '~/actions/GiftActionCreators';

interface GiftState {
	loading: boolean;
	error: Error | null;
	data: Gift | null;
	invalid?: boolean;
}

class GiftStore {
	gifts: Map<string, GiftState> = observable.map();
	pendingRequests: Map<string, Promise<Gift>> = observable.map();

	constructor() {
		makeAutoObservable(
			this,
			{
				gifts: false,
				pendingRequests: false,
			},
			{autoBind: true},
		);
	}

	markAsRedeemed(code: string): void {
		const existingGift = this.gifts.get(code);
		if (existingGift?.data) {
			const updatedGift: Gift = {
				...existingGift.data,
				redeemed: true,
			};
			this.gifts.set(code, {
				...existingGift,
				data: updatedGift,
			});
		}
	}

	markAsInvalid(code: string): void {
		this.gifts.set(code, {
			loading: false,
			error: new Error('Gift code not found'),
			data: null,
			invalid: true,
		});
	}

	async fetchGift(code: string): Promise<Gift> {
		const existingGift = this.gifts.get(code);
		if (existingGift?.invalid) {
			throw new Error('Gift code not found');
		}

		const existingRequest = this.pendingRequests.get(code);
		if (existingRequest) {
			return existingRequest;
		}

		if (existingGift?.data) {
			return existingGift.data;
		}

		this.gifts.set(code, {loading: true, error: null, data: null});

		const promise = GiftActionCreators.fetch(code);

		this.pendingRequests.set(code, promise);

		try {
			const gift = await promise;
			runInAction(() => {
				this.pendingRequests.delete(code);
				this.gifts.set(code, {loading: false, error: null, data: gift});
			});
			return gift;
		} catch (error) {
			runInAction(() => {
				this.pendingRequests.delete(code);
				this.gifts.set(code, {
					loading: false,
					error: error as Error,
					data: null,
				});
			});
			throw error;
		}
	}
}

export default new GiftStore();
