/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useEffect} from 'react';
import {trackPageView} from '~/utils/yandexMetrika';

interface SEOConfig {
	title: string;
	description: string;
	keywords?: string;
	canonicalPath?: string;
	ogType?: string;
	ogImage?: string;
	noindex?: boolean;
}

const SITE_URL = 'https://floodilka.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/icons/og-image-default.png`;

const setMetaTag = (attribute: string, key: string, content: string) => {
	let element = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
	if (!element) {
		element = document.createElement('meta');
		element.setAttribute(attribute, key);
		document.head.appendChild(element);
	}
	element.setAttribute('content', content);
};

const setCanonical = (url: string) => {
	let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
	if (!link) {
		link = document.createElement('link');
		link.setAttribute('rel', 'canonical');
		document.head.appendChild(link);
	}
	link.setAttribute('href', url);
};

export const useSEO = (config: SEOConfig) => {
	useEffect(() => {
		const {title, description, keywords, canonicalPath, ogType, ogImage, noindex} = config;

		// Title
		document.title = title;

		// Standard meta
		setMetaTag('name', 'description', description);
		if (keywords) {
			setMetaTag('name', 'keywords', keywords);
		}

		// Robots
		if (noindex) {
			setMetaTag('name', 'robots', 'noindex, nofollow');
		} else {
			const existing = document.querySelector('meta[name="robots"]');
			if (existing) {
				existing.remove();
			}
		}

		// Canonical
		const canonicalUrl = canonicalPath ? `${SITE_URL}${canonicalPath}` : SITE_URL;
		setCanonical(canonicalUrl);

		// Open Graph
		setMetaTag('property', 'og:title', title);
		setMetaTag('property', 'og:description', description);
		setMetaTag('property', 'og:url', canonicalUrl);
		setMetaTag('property', 'og:type', ogType ?? 'website');
		setMetaTag('property', 'og:image', ogImage ?? DEFAULT_OG_IMAGE);

		// Twitter Card
		setMetaTag('name', 'twitter:title', title);
		setMetaTag('name', 'twitter:description', description);
		setMetaTag('name', 'twitter:image', ogImage ?? DEFAULT_OG_IMAGE);

		// Analytics
		trackPageView(canonicalUrl, title);
	}, [config.title, config.description, config.keywords, config.canonicalPath, config.ogType, config.ogImage, config.noindex]);
};
