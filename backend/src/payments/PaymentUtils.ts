/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createHmac} from 'crypto';

export function addMonthsClamp(date: Date, months: number): Date {
	const d = new Date(date);
	const day = d.getDate();
	d.setMonth(d.getMonth() + months);
	if (d.getDate() < day) {
		d.setDate(0);
	}
	return d;
}

export function verifyCloudPaymentsWebhook(body: string, signature: string, apiSecret: string): boolean {
	const expectedSignature = createHmac('sha256', apiSecret).update(body).digest('base64');
	return signature === expectedSignature;
}

export function rublesToKopecks(rubles: number): number {
	return Math.round(rubles * 100);
}
