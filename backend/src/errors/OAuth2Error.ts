/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {HTTPException} from 'hono/http-exception';

type ErrorStatusCode = 400 | 401 | 403;

export class OAuth2Error extends HTTPException {
	error: string;
	errorDescription: string;
	override status: ErrorStatusCode;

	constructor({
		error,
		errorDescription,
		status = 400,
	}: {
		error: string;
		errorDescription: string;
		status?: ErrorStatusCode;
	}) {
		super(status, {message: errorDescription});
		this.error = error;
		this.errorDescription = errorDescription;
		this.status = status;
		this.name = 'OAuth2Error';
	}

	override getResponse(): Response {
		return new Response(
			JSON.stringify({
				error: this.error,
				error_description: this.errorDescription,
			}),
			{
				status: this.status,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
	}
}
