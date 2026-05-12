/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import DeveloperOptionsStore from '~/stores/DeveloperOptionsStore';
import GuildNSFWAgreeStore, {NSFWGateReason} from '~/stores/GuildNSFWAgreeStore';

interface NSFWMediaResult {
	shouldBlur: boolean;
	gateReason: NSFWGateReason;
}

export function useNSFWMedia(nsfw: boolean | undefined, channelId: string | undefined): NSFWMediaResult {
	const mockNSFWMediaGateReason = DeveloperOptionsStore.mockNSFWMediaGateReason;

	const effectiveNSFW = mockNSFWMediaGateReason !== 'none' ? true : !!nsfw;
	const gateReasonFromStore = GuildNSFWAgreeStore.getGateReason(channelId ?? '');

	let gateReason: NSFWGateReason;
	if (mockNSFWMediaGateReason !== 'none') {
		gateReason = NSFWGateReason.AGE_RESTRICTED;
	} else if (effectiveNSFW && channelId) {
		gateReason = gateReasonFromStore;
	} else {
		gateReason = NSFWGateReason.NONE;
	}

	const shouldBlur: boolean =
		effectiveNSFW && gateReason !== NSFWGateReason.NONE && gateReason !== NSFWGateReason.CONSENT_REQUIRED;

	return {shouldBlur, gateReason};
}
