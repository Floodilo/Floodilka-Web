/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import * as Sentry from '@sentry/node';
import type {ErrorHandler, NotFoundHandler} from 'hono';
import {HTTPException} from 'hono/http-exception';
import type {HonoEnv} from '~/App';
import {APIErrorCodes} from '~/Constants';
import {Logger} from '~/Logger';
import {FloodilkaAPIError} from './FloodilkaAPIError';

export const AppErrorHandler: ErrorHandler<HonoEnv> = (err) => {
	const isExpectedError = err instanceof Error && 'isExpected' in err && err.isExpected;

	if (!(err instanceof FloodilkaAPIError || isExpectedError)) {
		Sentry.captureException(err);
	}

	if (err instanceof FloodilkaAPIError) {
		return err.getResponse();
	}
	if (err instanceof HTTPException) {
		return new Response(JSON.stringify({code: APIErrorCodes.GENERAL_ERROR, message: err.message}), {
			status: err.status,
			headers: {'Content-Type': 'application/json'},
		});
	}
	if (isExpectedError) {
		Logger.warn({err}, 'Expected error occurred');
		return new Response(JSON.stringify({code: APIErrorCodes.GENERAL_ERROR, message: err.message}), {
			status: 400,
			headers: {'Content-Type': 'application/json'},
		});
	}
	Logger.error({err}, 'Unhandled error occurred');
	const error = new FloodilkaAPIError({
		code: APIErrorCodes.GENERAL_ERROR,
		message: 'Произошла внутренняя ошибка сервера.',
		status: 500,
	});
	return error.getResponse();
};

export const AppNotFoundHandler: NotFoundHandler<HonoEnv> = () => {
	const error = new FloodilkaAPIError({
		code: APIErrorCodes.GENERAL_ERROR,
		message: 'Запрашиваемый эндпоинт не существует.',
		status: 404,
	});
	return error.getResponse();
};
