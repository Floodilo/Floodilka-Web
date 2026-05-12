/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Logger} from '~/lib/Logger';

export interface QueueEntry<TMessage, TResult = void> {
	message: TMessage;
	success: (result?: TResult, error?: unknown) => void;
}

interface RetryInfo {
	retryAfter?: number;
}

export interface QueueConfig {
	logger?: Logger;
	defaultRetryAfter?: number;
}

export abstract class Queue<TMessage, TResult = void> {
	protected readonly logger: Logger;
	protected readonly defaultRetryAfter: number;
	protected readonly queue: Array<QueueEntry<TMessage, TResult>>;

	private retryTimerId: number | null;
	private isDraining: boolean;

	constructor(config: QueueConfig = {}) {
		this.logger = config.logger ?? new Logger('Queue');
		this.defaultRetryAfter = config.defaultRetryAfter ?? 100;
		this.queue = [];
		this.retryTimerId = null;
		this.isDraining = false;
	}

	protected abstract drain(
		message: TMessage,
		complete: (retry: RetryInfo | null, result?: TResult, error?: unknown) => void,
	): void;

	enqueue(message: TMessage, success: (result?: TResult, error?: unknown) => void): void {
		this.queue.push({message, success});
		this.maybeProcessNext();
	}

	get queueLength(): number {
		return this.queue.length;
	}

	clear(): void {
		if (this.retryTimerId !== null) {
			clearTimeout(this.retryTimerId);
			this.retryTimerId = null;
		}
		this.queue.length = 0;
		this.isDraining = false;
	}

	peek(): TMessage | undefined {
		return this.queue[0]?.message;
	}

	private maybeProcessNext(): void {
		if (this.retryTimerId !== null || this.queue.length === 0 || this.isDraining) {
			return;
		}

		const entry = this.queue.shift();
		if (!entry) {
			this.isDraining = false;
			return;
		}

		this.isDraining = true;

		const {message, success} = entry;

		let hasCompleted = false;

		const complete = (retry: RetryInfo | null, result?: TResult, error?: unknown): void => {
			if (hasCompleted) {
				this.logger.warn('Queue completion callback invoked more than once; ignoring extra call');
				return;
			}

			hasCompleted = true;
			this.isDraining = false;

			this.logger.info(`Finished processing queued item; ${this.queue.length} item(s) remaining in queue`);

			if (retry === null) {
				setTimeout(() => this.maybeProcessNext(), 0);

				try {
					success(result, error);
				} catch (callbackError) {
					this.logger.error('Error in queue success callback', callbackError);
				}
				return;
			}

			const delay = retry.retryAfter ?? this.defaultRetryAfter;

			this.logger.info(
				`Pausing queue processing for ${delay}ms due to retry request; ${this.queue.length} item(s) waiting`,
			);

			this.retryTimerId = window.setTimeout(() => {
				this.queue.unshift(entry);
				this.retryTimerId = null;
				this.maybeProcessNext();
			}, delay);
		};

		this.logger.info(`Processing queued item; ${this.queue.length} item(s) left after dequeue`);

		try {
			this.drain(message, complete);
		} catch (error) {
			this.logger.error('Unhandled error while draining queue item', error);
			if (!hasCompleted) {
				complete(null, undefined, error);
			}
		}
	}
}
