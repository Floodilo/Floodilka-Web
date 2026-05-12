/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import CountryCodeStore from '~/stores/CountryCodeStore';

export interface CountryCode {
	code: string;
	dialCode: string;
	flag: string;
	format?: string;
}

export const COUNTRY_CODES: ReadonlyArray<CountryCode> = [
	{code: 'US', dialCode: '+1', flag: '🇺🇸', format: '(###) ###-####'},
	{code: 'CA', dialCode: '+1', flag: '🇨🇦', format: '(###) ###-####'},
	{code: 'BS', dialCode: '+1-242', flag: '🇧🇸'},
	{code: 'BB', dialCode: '+1-246', flag: '🇧🇧'},
	{code: 'AG', dialCode: '+1-268', flag: '🇦🇬'},
	{code: 'DM', dialCode: '+1-767', flag: '🇩🇲'},
	{code: 'DO', dialCode: '+1-809', flag: '🇩🇴'},
	{code: 'JM', dialCode: '+1-876', flag: '🇯🇲'},
	{code: 'TT', dialCode: '+1-868', flag: '🇹🇹'},

	{code: 'EG', dialCode: '+20', flag: '🇪🇬', format: '### ### ####'},
	{code: 'ZA', dialCode: '+27', flag: '🇿🇦', format: '## ### ####'},
	{code: 'DZ', dialCode: '+213', flag: '🇩🇿'},
	{code: 'MA', dialCode: '+212', flag: '🇲🇦'},
	{code: 'TN', dialCode: '+216', flag: '🇹🇳'},
	{code: 'LY', dialCode: '+218', flag: '🇱🇾'},
	{code: 'GM', dialCode: '+220', flag: '🇬🇲'},
	{code: 'SN', dialCode: '+221', flag: '🇸🇳'},
	{code: 'MR', dialCode: '+222', flag: '🇲🇷'},
	{code: 'ML', dialCode: '+223', flag: '🇲🇱'},
	{code: 'GN', dialCode: '+224', flag: '🇬🇳'},
	{code: 'CI', dialCode: '+225', flag: '🇨🇮'},
	{code: 'BF', dialCode: '+226', flag: '🇧🇫'},
	{code: 'NE', dialCode: '+227', flag: '🇳🇪'},
	{code: 'TG', dialCode: '+228', flag: '🇹🇬'},
	{code: 'BJ', dialCode: '+229', flag: '🇧🇯'},
	{code: 'MU', dialCode: '+230', flag: '🇲🇺'},
	{code: 'LR', dialCode: '+231', flag: '🇱🇷'},
	{code: 'SL', dialCode: '+232', flag: '🇸🇱'},
	{code: 'GH', dialCode: '+233', flag: '🇬🇭'},
	{code: 'NG', dialCode: '+234', flag: '🇳🇬', format: '### ### ####'},
	{code: 'TD', dialCode: '+235', flag: '🇹🇩'},
	{code: 'CF', dialCode: '+236', flag: '🇨🇫'},
	{code: 'CM', dialCode: '+237', flag: '🇨🇲'},
	{code: 'CV', dialCode: '+238', flag: '🇨🇻'},
	{code: 'ST', dialCode: '+239', flag: '🇸🇹'},
	{code: 'GQ', dialCode: '+240', flag: '🇬🇶'},
	{code: 'GA', dialCode: '+241', flag: '🇬🇦'},
	{code: 'CG', dialCode: '+242', flag: '🇨🇬'},
	{code: 'CD', dialCode: '+243', flag: '🇨🇩'},
	{code: 'AO', dialCode: '+244', flag: '🇦🇴'},
	{code: 'GW', dialCode: '+245', flag: '🇬🇼'},
	{code: 'SC', dialCode: '+248', flag: '🇸🇨'},
	{code: 'SD', dialCode: '+249', flag: '🇸🇩'},
	{code: 'RW', dialCode: '+250', flag: '🇷🇼'},
	{code: 'ET', dialCode: '+251', flag: '🇪🇹'},
	{code: 'SO', dialCode: '+252', flag: '🇸🇴'},
	{code: 'DJ', dialCode: '+253', flag: '🇩🇯'},
	{code: 'KE', dialCode: '+254', flag: '🇰🇪'},
	{code: 'TZ', dialCode: '+255', flag: '🇹🇿'},
	{code: 'UG', dialCode: '+256', flag: '🇺🇬'},
	{code: 'BI', dialCode: '+257', flag: '🇧🇮'},
	{code: 'MZ', dialCode: '+258', flag: '🇲🇿'},
	{code: 'ZM', dialCode: '+260', flag: '🇿🇲'},
	{code: 'MG', dialCode: '+261', flag: '🇲🇬'},
	{code: 'RE', dialCode: '+262', flag: '🇷🇪'},
	{code: 'ZW', dialCode: '+263', flag: '🇿🇼'},
	{code: 'NA', dialCode: '+264', flag: '🇳🇦'},
	{code: 'MW', dialCode: '+265', flag: '🇲🇼'},
	{code: 'LS', dialCode: '+266', flag: '🇱🇸'},
	{code: 'BW', dialCode: '+267', flag: '🇧🇼'},
	{code: 'SZ', dialCode: '+268', flag: '🇸🇿'},
	{code: 'KM', dialCode: '+269', flag: '🇰🇲'},

	{code: 'GR', dialCode: '+30', flag: '🇬🇷', format: '### ### ####'},
	{code: 'NL', dialCode: '+31', flag: '🇳🇱', format: '## ########'},
	{code: 'BE', dialCode: '+32', flag: '🇧🇪', format: '### ## ## ##'},
	{code: 'FR', dialCode: '+33', flag: '🇫🇷', format: '# ## ## ## ##'},
	{code: 'ES', dialCode: '+34', flag: '🇪🇸', format: '### ### ###'},
	{code: 'HU', dialCode: '+36', flag: '🇭🇺', format: '## ### ####'},
	{code: 'IT', dialCode: '+39', flag: '🇮🇹', format: '### ### ####'},
	{code: 'RO', dialCode: '+40', flag: '🇷🇴', format: '### ### ###'},
	{code: 'CH', dialCode: '+41', flag: '🇨🇭', format: '## ### ## ##'},
	{code: 'AT', dialCode: '+43', flag: '🇦🇹', format: '### ######'},
	{code: 'GB', dialCode: '+44', flag: '🇬🇧', format: '#### ### ####'},
	{code: 'DK', dialCode: '+45', flag: '🇩🇰', format: '## ## ## ##'},
	{code: 'SE', dialCode: '+46', flag: '🇸🇪', format: '## ### ## ##'},
	{code: 'NO', dialCode: '+47', flag: '🇳🇴', format: '### ## ###'},
	{code: 'PL', dialCode: '+48', flag: '🇵🇱', format: '### ### ###'},
	{code: 'DE', dialCode: '+49', flag: '🇩🇪', format: '### ########'},
	{code: 'PE', dialCode: '+51', flag: '🇵🇪'},
	{code: 'MX', dialCode: '+52', flag: '🇲🇽', format: '### ### ####'},
	{code: 'CU', dialCode: '+53', flag: '🇨🇺'},
	{code: 'AR', dialCode: '+54', flag: '🇦🇷', format: '## ####-####'},
	{code: 'BR', dialCode: '+55', flag: '🇧🇷', format: '(##) #####-####'},
	{code: 'CL', dialCode: '+56', flag: '🇨🇱', format: '# #### ####'},
	{code: 'CO', dialCode: '+57', flag: '🇨🇴', format: '### #######'},
	{code: 'VE', dialCode: '+58', flag: '🇻🇪'},
	{code: 'MY', dialCode: '+60', flag: '🇲🇾', format: '##-### ####'},
	{code: 'AU', dialCode: '+61', flag: '🇦🇺', format: '#### ### ###'},
	{code: 'ID', dialCode: '+62', flag: '🇮🇩', format: '###-###-####'},
	{code: 'PH', dialCode: '+63', flag: '🇵🇭', format: '#### ### ####'},
	{code: 'NZ', dialCode: '+64', flag: '🇳🇿', format: '## ### ####'},
	{code: 'SG', dialCode: '+65', flag: '🇸🇬', format: '#### ####'},
	{code: 'TH', dialCode: '+66', flag: '🇹🇭', format: '## ### ####'},
	{code: 'JP', dialCode: '+81', flag: '🇯🇵', format: '##-####-####'},
	{code: 'KR', dialCode: '+82', flag: '🇰🇷', format: '##-####-####'},
	{code: 'VN', dialCode: '+84', flag: '🇻🇳', format: '### ### ####'},
	{code: 'CN', dialCode: '+86', flag: '🇨🇳', format: '### #### ####'},
	{code: 'TR', dialCode: '+90', flag: '🇹🇷', format: '(###) ### ## ##'},
	{code: 'IN', dialCode: '+91', flag: '🇮🇳', format: '##### #####'},
	{code: 'PK', dialCode: '+92', flag: '🇵🇰', format: '### #######'},
	{code: 'AF', dialCode: '+93', flag: '🇦🇫'},
	{code: 'LK', dialCode: '+94', flag: '🇱🇰'},
	{code: 'MM', dialCode: '+95', flag: '🇲🇲'},
	{code: 'IR', dialCode: '+98', flag: '🇮🇷'},

	{code: 'FI', dialCode: '+358', flag: '🇫🇮', format: '## ### ####'},
	{code: 'BG', dialCode: '+359', flag: '🇧🇬'},
	{code: 'LT', dialCode: '+370', flag: '🇱🇹'},
	{code: 'LV', dialCode: '+371', flag: '🇱🇻'},
	{code: 'EE', dialCode: '+372', flag: '🇪🇪'},
	{code: 'MD', dialCode: '+373', flag: '🇲🇩'},
	{code: 'AM', dialCode: '+374', flag: '🇦🇲'},
	{code: 'BY', dialCode: '+375', flag: '🇧🇾'},
	{code: 'AD', dialCode: '+376', flag: '🇦🇩'},
	{code: 'MC', dialCode: '+377', flag: '🇲🇨'},
	{code: 'SM', dialCode: '+378', flag: '🇸🇲'},
	{code: 'VA', dialCode: '+379', flag: '🇻🇦'},
	{code: 'UA', dialCode: '+380', flag: '🇺🇦', format: '## ### ####'},
	{code: 'RS', dialCode: '+381', flag: '🇷🇸'},
	{code: 'ME', dialCode: '+382', flag: '🇲🇪'},
	{code: 'HR', dialCode: '+385', flag: '🇭🇷'},
	{code: 'SI', dialCode: '+386', flag: '🇸🇮'},
	{code: 'BA', dialCode: '+387', flag: '🇧🇦'},
	{code: 'MK', dialCode: '+389', flag: '🇲🇰'},
	{code: 'CZ', dialCode: '+420', flag: '🇨🇿', format: '### ### ###'},
	{code: 'SK', dialCode: '+421', flag: '🇸🇰'},

	{code: 'BZ', dialCode: '+501', flag: '🇧🇿'},
	{code: 'GT', dialCode: '+502', flag: '🇬🇹'},
	{code: 'SV', dialCode: '+503', flag: '🇸🇻'},
	{code: 'HN', dialCode: '+504', flag: '🇭🇳'},
	{code: 'NI', dialCode: '+505', flag: '🇳🇮'},
	{code: 'CR', dialCode: '+506', flag: '🇨🇷'},
	{code: 'PA', dialCode: '+507', flag: '🇵🇦'},
	{code: 'HT', dialCode: '+509', flag: '🇭🇹'},
	{code: 'BO', dialCode: '+591', flag: '🇧🇴'},
	{code: 'GY', dialCode: '+592', flag: '🇬🇾'},
	{code: 'EC', dialCode: '+593', flag: '🇪🇨'},
	{code: 'PY', dialCode: '+595', flag: '🇵🇾'},
	{code: 'SR', dialCode: '+597', flag: '🇸🇷'},
	{code: 'UY', dialCode: '+598', flag: '🇺🇾'},

	{code: 'BN', dialCode: '+673', flag: '🇧🇳'},
	{code: 'NR', dialCode: '+674', flag: '🇳🇷'},
	{code: 'PG', dialCode: '+675', flag: '🇵🇬'},
	{code: 'TO', dialCode: '+676', flag: '🇹🇴'},
	{code: 'SB', dialCode: '+677', flag: '🇸🇧'},
	{code: 'VU', dialCode: '+678', flag: '🇻🇺'},
	{code: 'FJ', dialCode: '+679', flag: '🇫🇯'},
	{code: 'PW', dialCode: '+680', flag: '🇵🇼'},
	{code: 'WS', dialCode: '+685', flag: '🇼🇸'},
	{code: 'KI', dialCode: '+686', flag: '🇰🇮'},
	{code: 'NC', dialCode: '+687', flag: '🇳🇨'},
	{code: 'TV', dialCode: '+688', flag: '🇹🇻'},
	{code: 'PF', dialCode: '+689', flag: '🇵🇫'},

	{code: 'RU', dialCode: '+7', flag: '🇷🇺', format: '(###) ###-##-##'},
	{code: 'KZ', dialCode: '+7', flag: '🇰🇿'},

	{code: 'HK', dialCode: '+852', flag: '🇭🇰', format: '#### ####'},
	{code: 'MO', dialCode: '+853', flag: '🇲🇴'},
	{code: 'KH', dialCode: '+855', flag: '🇰🇭'},
	{code: 'LA', dialCode: '+856', flag: '🇱🇦'},
	{code: 'BD', dialCode: '+880', flag: '🇧🇩', format: '####-######'},
	{code: 'TW', dialCode: '+886', flag: '🇹🇼', format: '#### ####'},
	{code: 'MV', dialCode: '+960', flag: '🇲🇻'},
	{code: 'LB', dialCode: '+961', flag: '🇱🇧'},
	{code: 'JO', dialCode: '+962', flag: '🇯🇴'},
	{code: 'SY', dialCode: '+963', flag: '🇸🇾'},
	{code: 'IQ', dialCode: '+964', flag: '🇮🇶'},
	{code: 'KW', dialCode: '+965', flag: '🇰🇼'},
	{code: 'SA', dialCode: '+966', flag: '🇸🇦', format: '## ### ####'},
	{code: 'YE', dialCode: '+967', flag: '🇾🇪'},
	{code: 'OM', dialCode: '+968', flag: '🇴🇲'},
	{code: 'PS', dialCode: '+970', flag: '🇵🇸'},
	{code: 'AE', dialCode: '+971', flag: '🇦🇪', format: '## ### ####'},
	{code: 'IL', dialCode: '+972', flag: '🇮🇱', format: '##-###-####'},
	{code: 'BH', dialCode: '+973', flag: '🇧🇭'},
	{code: 'QA', dialCode: '+974', flag: '🇶🇦'},
	{code: 'BT', dialCode: '+975', flag: '🇧🇹'},
	{code: 'MN', dialCode: '+976', flag: '🇲🇳'},
	{code: 'NP', dialCode: '+977', flag: '🇳🇵'},
	{code: 'TJ', dialCode: '+992', flag: '🇹🇯'},
	{code: 'TM', dialCode: '+993', flag: '🇹🇲'},
	{code: 'AZ', dialCode: '+994', flag: '🇦🇿'},
	{code: 'GE', dialCode: '+995', flag: '🇬🇪'},
	{code: 'KG', dialCode: '+996', flag: '🇰🇬'},
	{code: 'UZ', dialCode: '+998', flag: '🇺🇿'},

	{code: 'PT', dialCode: '+351', flag: '🇵🇹', format: '### ### ###'},
	{code: 'LU', dialCode: '+352', flag: '🇱🇺'},
	{code: 'IE', dialCode: '+353', flag: '🇮🇪', format: '## ### ####'},
	{code: 'IS', dialCode: '+354', flag: '🇮🇸'},
	{code: 'AL', dialCode: '+355', flag: '🇦🇱'},
	{code: 'MT', dialCode: '+356', flag: '🇲🇹'},
	{code: 'CY', dialCode: '+357', flag: '🇨🇾'},
] as const;

export const getDefaultCountry = (): CountryCode => {
	const countryCode = CountryCodeStore.countryCode;
	const country = COUNTRY_CODES.find((c) => c.code === countryCode);
	return country || COUNTRY_CODES.find((c) => c.code === 'US')!;
};

export const formatPhoneNumber = (value: string, country: CountryCode): string => {
	const digits = value.replace(/\D/g, '');

	if (!country.format) {
		return digits;
	}

	let formatted = '';
	let digitIndex = 0;

	for (const char of country.format) {
		if (char === '#') {
			if (digitIndex < digits.length) {
				formatted += digits[digitIndex];
				digitIndex++;
			} else {
				break;
			}
		} else {
			if (digitIndex > 0 && digitIndex < digits.length) {
				formatted += char;
			}
		}
	}

	return formatted;
};

export const getE164PhoneNumber = (phoneNumber: string, country: CountryCode): string => {
	const digits = phoneNumber.replace(/\D/g, '');
	return `${country.dialCode}${digits}`;
};

export const getCountryName = (countryCode: string, locale: string): string => {
	const regionNames = new Intl.DisplayNames([locale], {type: 'region'});
	return regionNames.of(countryCode) || countryCode;
};
