/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {PremiumModal} from '~/components/modals/PremiumModal';
import RuntimeConfigStore from '~/stores/RuntimeConfigStore';

interface OpenOptions {
	defaultGiftMode?: boolean;
}

export const open = (optionsOrDefaultGiftMode: OpenOptions | boolean = {}): void => {
	if (RuntimeConfigStore.isSelfHosted()) {
		return;
	}

	const options =
		typeof optionsOrDefaultGiftMode === 'boolean'
			? {defaultGiftMode: optionsOrDefaultGiftMode}
			: optionsOrDefaultGiftMode;
	const {defaultGiftMode = false} = options;
	ModalActionCreators.push(modal(() => <PremiumModal defaultGiftMode={defaultGiftMode} />));
};
