/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageEmbedProvider} from '~/database/CassandraTypes';

export class EmbedProvider {
	readonly name: string | null;
	readonly url: string | null;

	constructor(provider: MessageEmbedProvider) {
		this.name = provider.name ?? null;
		this.url = provider.url ?? null;
	}

	toMessageEmbedProvider(): MessageEmbedProvider {
		return {
			name: this.name,
			url: this.url,
		};
	}
}
