/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageEmbed} from '~/database/CassandraTypes';
import {EmbedAuthor} from './EmbedAuthor';
import {EmbedField} from './EmbedField';
import {EmbedFooter} from './EmbedFooter';
import {EmbedMedia} from './EmbedMedia';
import {EmbedProvider} from './EmbedProvider';

export class Embed {
	readonly type: string | null;
	readonly title: string | null;
	readonly description: string | null;
	readonly url: string | null;
	readonly timestamp: Date | null;
	readonly color: number | null;
	readonly author: EmbedAuthor | null;
	readonly provider: EmbedProvider | null;
	readonly thumbnail: EmbedMedia | null;
	readonly image: EmbedMedia | null;
	readonly video: EmbedMedia | null;
	readonly footer: EmbedFooter | null;
	readonly fields: Array<EmbedField>;
	readonly nsfw: boolean | null;

	constructor(embed: MessageEmbed) {
		this.type = embed.type ?? null;
		this.title = embed.title ?? null;
		this.description = embed.description ?? null;
		this.url = embed.url ?? null;
		this.timestamp = embed.timestamp ? new Date(embed.timestamp) : null;
		this.color = embed.color ?? null;
		this.author = embed.author ? new EmbedAuthor(embed.author) : null;
		this.provider = embed.provider ? new EmbedProvider(embed.provider) : null;
		this.thumbnail = embed.thumbnail ? new EmbedMedia(embed.thumbnail) : null;
		this.image = embed.image ? new EmbedMedia(embed.image) : null;
		this.video = embed.video ? new EmbedMedia(embed.video) : null;
		this.footer = embed.footer ? new EmbedFooter(embed.footer) : null;
		this.fields = (embed.fields ?? []).map((field) => new EmbedField(field));
		this.nsfw = embed.nsfw ?? null;
	}

	toMessageEmbed(): MessageEmbed {
		return {
			type: this.type,
			title: this.title,
			description: this.description,
			url: this.url,
			timestamp: this.timestamp,
			color: this.color,
			author: this.author?.toMessageEmbedAuthor() ?? null,
			provider: this.provider?.toMessageEmbedProvider() ?? null,
			thumbnail: this.thumbnail?.toMessageEmbedMedia() ?? null,
			image: this.image?.toMessageEmbedMedia() ?? null,
			video: this.video?.toMessageEmbedMedia() ?? null,
			footer: this.footer?.toMessageEmbedFooter() ?? null,
			fields: this.fields.length > 0 ? this.fields.map((field) => field.toMessageEmbedField()) : null,
			nsfw: this.nsfw,
		};
	}
}
