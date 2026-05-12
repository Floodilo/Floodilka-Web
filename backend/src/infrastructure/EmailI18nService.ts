/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import MessageFormat from '@messageformat/core';
import {Logger} from '~/Logger';
import {type EmailTemplateKey, type EmailTemplateVariables, getLocaleTranslations, hasLocale} from './email_i18n';

export interface LocalizedEmailTemplate {
	subject: string;
	body: string;
}

export class EmailI18nService {
	private readonly defaultLocale = 'en-US';
	private readonly messageFormatCache: Map<string, MessageFormat> = new Map();

	getTemplate<T extends EmailTemplateKey>(
		templateKey: T,
		locale: string | null,
		variables: EmailTemplateVariables[T],
	): LocalizedEmailTemplate {
		const effectiveLocale = this.getEffectiveLocale(locale);
		const translations = getLocaleTranslations(effectiveLocale);
		const fallbackTranslations = getLocaleTranslations(this.defaultLocale);
		const template = translations[templateKey] ?? fallbackTranslations[templateKey];
		if (!template) {
			throw new Error(`Missing email template ${templateKey} for locale ${effectiveLocale}`);
		}

		const subjectMf = this.getMessageFormat(effectiveLocale);
		const subject = subjectMf.compile(template.subject)(variables);

		const bodyMf = this.getMessageFormat(effectiveLocale);
		const body = bodyMf.compile(template.body)(variables);

		return {subject, body};
	}

	formatDate(
		date: Date,
		locale: string | null,
		options: Intl.DateTimeFormatOptions = {dateStyle: 'full', timeStyle: 'short'},
	): string {
		const effectiveLocale = this.getEffectiveLocale(locale);
		return date.toLocaleString(effectiveLocale, options);
	}

	formatNumber(num: number, locale: string | null): string {
		const effectiveLocale = this.getEffectiveLocale(locale);
		return num.toLocaleString(effectiveLocale);
	}

	private getMessageFormat(locale: string): MessageFormat {
		if (!this.messageFormatCache.has(locale)) {
			this.messageFormatCache.set(locale, new MessageFormat(locale));
		}
		return this.messageFormatCache.get(locale)!;
	}

	private getEffectiveLocale(locale: string | null): string {
		if (!locale) {
			return this.defaultLocale;
		}

		if (!hasLocale(locale)) {
			Logger.warn({locale}, 'Unsupported locale for email, falling back to en-US');
			return this.defaultLocale;
		}

		return locale;
	}
}
