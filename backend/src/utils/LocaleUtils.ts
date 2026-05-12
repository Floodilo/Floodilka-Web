/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Locales} from '~/Constants';

const SUPPORTED_LOCALES = new Set<string>(Object.values(Locales));
const DEFAULT_LOCALE = Locales.RU;

export function parseAcceptLanguage(acceptLanguageHeader: string | null | undefined): string {
	if (!acceptLanguageHeader) {
		return DEFAULT_LOCALE;
	}

	try {
		const languages = acceptLanguageHeader
			.split(',')
			.map((lang) => {
				const parts = lang.trim().split(';');
				const locale = parts[0].trim();
				const qMatch = parts[1]?.match(/q=([\d.]+)/);
				const quality = qMatch ? Number.parseFloat(qMatch[1]) : 1.0;
				return {locale, quality};
			})
			.sort((a, b) => b.quality - a.quality);

		for (const {locale} of languages) {
			for (const supportedLocale of SUPPORTED_LOCALES) {
				if (supportedLocale.toLowerCase() === locale.toLowerCase()) {
					return supportedLocale;
				}
			}
		}

		const languagePreferences: Record<string, string> = {
			en: Locales.EN_US,
			es: Locales.ES_ES,
			pt: Locales.PT_BR,
			zh: Locales.ZH_CN,
			sv: Locales.SV_SE,
		};

		for (const {locale} of languages) {
			const languageCode = locale.split('-')[0].toLowerCase();

			if (languagePreferences[languageCode] && SUPPORTED_LOCALES.has(languagePreferences[languageCode])) {
				return languagePreferences[languageCode];
			}

			for (const supportedLocale of SUPPORTED_LOCALES) {
				if (supportedLocale.toLowerCase().startsWith(`${languageCode}-`)) {
					return supportedLocale;
				}
			}
		}

		return DEFAULT_LOCALE;
	} catch (_error) {
		return DEFAULT_LOCALE;
	}
}
