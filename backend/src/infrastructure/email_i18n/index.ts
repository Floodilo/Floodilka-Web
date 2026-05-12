/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import ar from './locales/ar.json';
import bg from './locales/bg.json';
import cs from './locales/cs.json';
import da from './locales/da.json';
import de from './locales/de.json';
import el from './locales/el.json';
import enGB from './locales/en-GB.json';
import enUS from './locales/en-US.json';
import es419 from './locales/es-419.json';
import esES from './locales/es-ES.json';
import fi from './locales/fi.json';
import fr from './locales/fr.json';
import he from './locales/he.json';
import hi from './locales/hi.json';
import hr from './locales/hr.json';
import hu from './locales/hu.json';
import id from './locales/id.json';
import it from './locales/it.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import lt from './locales/lt.json';
import nl from './locales/nl.json';
import no from './locales/no.json';
import pl from './locales/pl.json';
import ptBR from './locales/pt-BR.json';
import ro from './locales/ro.json';
import ru from './locales/ru.json';
import svSE from './locales/sv-SE.json';
import th from './locales/th.json';
import tr from './locales/tr.json';
import uk from './locales/uk.json';
import vi from './locales/vi.json';
import zhCN from './locales/zh-CN.json';
import zhTW from './locales/zh-TW.json';
import type {EmailTranslations} from './types';

const locales: Record<string, EmailTranslations> = {
	'en-US': enUS,
	'en-GB': enGB,
	ar,
	bg,
	cs,
	da,
	de,
	el,
	'es-ES': esES,
	'es-419': es419,
	fi,
	fr,
	he,
	hi,
	hr,
	hu,
	id,
	it,
	ja,
	ko,
	lt,
	nl,
	no,
	pl,
	'pt-BR': ptBR,
	ro,
	ru,
	'sv-SE': svSE,
	th,
	tr,
	uk,
	vi,
	'zh-CN': zhCN,
	'zh-TW': zhTW,
};

export function getLocaleTranslations(locale: string): EmailTranslations {
	return locales[locale] || locales['en-US'];
}

export function hasLocale(locale: string): boolean {
	return locale in locales;
}

export type {
	EmailTemplate,
	EmailTemplateKey,
	EmailTemplateVariables,
	EmailTranslations,
} from './types';
