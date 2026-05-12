/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {HTTPException} from 'hono/http-exception';

type ErrorStatusCode = 202 | 400 | 401 | 403 | 404 | 423 | 429 | 500 | 502 | 503 | 504;

export type FloodilkaErrorData = Record<string, unknown>;

export class FloodilkaAPIError extends HTTPException {
	code: string;
	override message: string;
	override status: ErrorStatusCode;
	data?: FloodilkaErrorData;
	headers?: Record<string, string>;

	constructor({
		code,
		message,
		status,
		data,
		headers,
	}: {
		code: string;
		message: string;
		status: ErrorStatusCode;
		data?: FloodilkaErrorData;
		headers?: Record<string, string>;
	}) {
		super(status, {message});
		this.code = code;
		this.message = message;
		this.status = status;
		this.data = data;
		this.headers = headers;
		this.name = 'FloodilkaAPIError';
	}

	override getResponse(): Response {
		return new Response(
			JSON.stringify({
				code: this.code,
				message: this.message,
				...this.data,
			}),
			{
				status: this.status,
				headers: {
					'Content-Type': 'application/json',
					...this.headers,
				},
			},
		);
	}
}
