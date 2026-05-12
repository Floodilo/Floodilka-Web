/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageEmbedFooter} from '~/database/CassandraTypes';

export class EmbedFooter {
	readonly text: string | null;
	readonly iconUrl: string | null;

	constructor(footer: MessageEmbedFooter) {
		this.text = footer.text ?? null;
		this.iconUrl = footer.icon_url ?? null;
	}

	toMessageEmbedFooter(): MessageEmbedFooter {
		return {
			text: this.text,
			icon_url: this.iconUrl,
		};
	}
}
