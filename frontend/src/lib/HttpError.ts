/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HttpMethod} from '~/lib/HttpTypes';

export class HttpError extends Error {
	method: HttpMethod;
	url: string;
	status?: number;
	ok: boolean;
	body?: unknown;
	text?: string;
	headers?: Record<string, string>;

	constructor(params: {
		method: HttpMethod;
		url: string;
		ok: boolean;
		status: number;
		body?: unknown;
		text?: string;
		headers?: Record<string, string>;
	}) {
		const redactedUrl = params.url.replace(/\d+/g, 'xxx');
		super(`${params.method.toUpperCase()} ${redactedUrl} [${params.status}]`);

		this.name = 'HTTPResponseError';
		this.method = params.method;
		this.url = params.url;
		this.ok = params.ok;
		this.status = params.status;
		this.body = params.body;
		this.text = params.text;
		this.headers = params.headers;
	}
}
