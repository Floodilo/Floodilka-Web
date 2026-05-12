/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageEmbedAuthor} from '~/database/CassandraTypes';

export class EmbedAuthor {
	readonly name: string | null;
	readonly url: string | null;
	readonly iconUrl: string | null;

	constructor(author: MessageEmbedAuthor) {
		this.name = author.name ?? null;
		this.url = author.url ?? null;
		this.iconUrl = author.icon_url ?? null;
	}

	toMessageEmbedAuthor(): MessageEmbedAuthor {
		return {
			name: this.name,
			url: this.url,
			icon_url: this.iconUrl,
		};
	}
}
