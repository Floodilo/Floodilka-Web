/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import RuntimeConfigStore from '~/stores/RuntimeConfigStore';
import * as CodeLinkUtils from '~/utils/CodeLinkUtils';

const GIFT_CONFIG: CodeLinkUtils.CodeLinkConfig = {
	get urlBase() {
		return RuntimeConfigStore.giftUrlBase;
	},
	path: 'gift',
};

export function findGifts(content: string | null): Array<string> {
	return CodeLinkUtils.findCodes(content, GIFT_CONFIG);
}
