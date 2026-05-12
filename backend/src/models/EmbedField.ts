/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {MessageEmbedField} from '~/database/CassandraTypes';

export class EmbedField {
	readonly name: string;
	readonly value: string;
	readonly inline: boolean;

	constructor(field: MessageEmbedField) {
		this.name = field.name ?? '';
		this.value = field.value ?? '';
		this.inline = field.inline ?? false;
	}

	toMessageEmbedField(): MessageEmbedField {
		return {
			name: this.name || null,
			value: this.value || null,
			inline: this.inline,
		};
	}
}
