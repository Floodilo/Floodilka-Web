/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {I18n} from '@lingui/core';
import i18n from '~/i18n';
import type {MessageRecord} from '~/records/MessageRecord';
import * as FavoriteMemeUtils from '~/utils/FavoriteMemeUtils';

export const deriveDefaultNameFromMessage = ({
	message,
	attachmentId,
	embedIndex,
	url,
	proxyUrl,
	i18nInstance = i18n,
}: {
	message: MessageRecord | undefined;
	attachmentId: string | undefined;
	embedIndex?: number | undefined;
	url: string;
	proxyUrl: string;
	i18nInstance?: I18n;
}): string => {
	if (message && attachmentId) {
		const attachment = message.attachments.find((a) => a.id === attachmentId);
		if (attachment) {
			return FavoriteMemeUtils.deriveDefaultNameFromAttachment(i18nInstance, attachment);
		}
	}

	if (message && embedIndex !== undefined) {
		const embed = message.embeds[embedIndex];
		if (embed) {
			return FavoriteMemeUtils.deriveDefaultNameFromEmbedMedia(
				i18nInstance,
				{url, proxy_url: proxyUrl, flags: 0},
				embed,
			);
		}
	}

	return FavoriteMemeUtils.deriveDefaultNameFromEmbedMedia(i18nInstance, {url, proxy_url: proxyUrl, flags: 0});
};

export const splitFilename = (filename: string): {name: string; extension: string} => {
	const lastDotIndex = filename.lastIndexOf('.');
	if (lastDotIndex === -1) {
		return {name: filename, extension: ''};
	}
	return {
		name: filename.substring(0, lastDotIndex),
		extension: filename.substring(lastDotIndex),
	};
};
