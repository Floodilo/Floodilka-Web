/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Logger} from '~/lib/Logger';

const logger = new Logger('YandexMetrika');

const TAG_SCRIPT_URL = 'https://mc.yandex.ru/metrika/tag.js';

type YmMethod =
	| 'init'
	| 'hit'
	| 'reachGoal'
	| 'setUserID'
	| 'userParams'
	| 'params'
	| 'extLink'
	| 'file'
	| 'notBounce'
	| 'getClientID';

type YmFn = (counterId: number, method: YmMethod, ...args: unknown[]) => void;
type YmStub = YmFn & {a?: unknown[][]; l?: number};

declare global {
	interface Window {
		ym?: YmStub;
	}
}

let counterId: number | null = null;
let bootstrapped = false;

function bootstrap(): void {
	if (bootstrapped) return;
	bootstrapped = true;

	if (!window.ym) {
		const stub: YmStub = function (...args: unknown[]) {
			(stub.a = stub.a || []).push(args);
		} as YmStub;
		stub.l = Date.now();
		window.ym = stub;
	}

	if (document.querySelector(`script[src="${TAG_SCRIPT_URL}"]`)) return;

	const script = document.createElement('script');
	script.src = TAG_SCRIPT_URL;
	script.async = true;
	script.onerror = () => {
		logger.warn('Failed to load Yandex Metrika tag.js');
	};

	const firstScript = document.getElementsByTagName('script')[0];
	if (firstScript?.parentNode) {
		firstScript.parentNode.insertBefore(script, firstScript);
	} else {
		document.head.appendChild(script);
	}
}

export function initYandexMetrika(id: string): void {
	const parsed = Number(id);
	if (!parsed || !Number.isFinite(parsed)) {
		logger.warn('Invalid Yandex Metrika counter ID:', id);
		return;
	}

	counterId = parsed;
	bootstrap();

	window.ym!(parsed, 'init', {
		defer: true,
		clickmap: true,
		trackLinks: true,
		accurateTrackBounce: true,
		webvisor: true,
	});

	logger.info('Yandex Metrika queued, counter:', parsed);
}

export function trackPageView(url: string, title?: string): void {
	if (counterId == null || !window.ym) return;
	window.ym(counterId, 'hit', url, {title});
}

export function reachGoal(target: string, params?: Record<string, unknown>): void {
	if (counterId == null || !window.ym) return;
	window.ym(counterId, 'reachGoal', target, params);
}
