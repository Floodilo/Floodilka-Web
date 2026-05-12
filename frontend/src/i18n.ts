/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {i18n, type Messages} from '@lingui/core';
import AppStorage from '~/lib/AppStorage';

import {messages as messagesEnUS} from '~/locales/en-US/messages.mjs';
import {messages as messagesRu} from '~/locales/ru/messages.mjs';

const supportedLocales = ['en-US', 'ru'] as const;

type LocaleCode = (typeof supportedLocales)[number];
const DEFAULT_LOCALE: LocaleCode = 'ru';

type LocaleLoader = () => {messages: Messages};

const loaders: Record<LocaleCode, LocaleLoader> = {
	'en-US': () => ({messages: messagesEnUS}),
	ru: () => ({messages: messagesRu}),
};

function detectPreferredLocale(): LocaleCode {
	return DEFAULT_LOCALE;
}

export function loadLocaleCatalog(localeCode: string): LocaleCode {
	const normalized: LocaleCode = localeCode === 'en-US' ? 'en-US' : 'ru';
	const {messages} = loaders[normalized]();
	i18n.loadAndActivate({locale: normalized, messages});
	AppStorage.setItem('locale', normalized);
	return normalized;
}

let initPromise: Promise<typeof i18n> | null = null;

export async function initI18n(forceLocale?: string) {
	if (!initPromise) {
		initPromise = (async () => {
			try {
				const localeToLoad = forceLocale === 'en-US' ? 'en-US' : detectPreferredLocale();
				loadLocaleCatalog(localeToLoad);
			} catch (error) {
				console.error('Failed to initialize i18n, falling back to default locale', error);
				loadLocaleCatalog(DEFAULT_LOCALE);
			}

			return i18n;
		})();
	}

	return initPromise;
}

export default i18n;
