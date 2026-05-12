/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export type Currency = 'USD' | 'EUR';

const EEA_COUNTRIES = [
	'AT',
	'BE',
	'BG',
	'HR',
	'CY',
	'CZ',
	'DK',
	'EE',
	'FI',
	'FR',
	'DE',
	'GR',
	'HU',
	'IE',
	'IT',
	'LV',
	'LT',
	'LU',
	'MT',
	'NL',
	'PL',
	'PT',
	'RO',
	'SK',
	'SI',
	'ES',
	'SE',
	'IS',
	'LI',
	'NO',
];

function isEEACountry(countryCode: string): boolean {
	const upperCode = countryCode.toUpperCase();
	return EEA_COUNTRIES.includes(upperCode);
}

export function getCurrency(countryCode: string | null | undefined): Currency {
	if (!countryCode) {
		return 'USD';
	}
	return isEEACountry(countryCode) ? 'EUR' : 'USD';
}
