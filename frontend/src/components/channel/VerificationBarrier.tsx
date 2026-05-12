/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type {ChannelRecord} from '~/records/ChannelRecord';
import GuildVerificationStore, {VerificationFailureReason} from '~/stores/GuildVerificationStore';
import {
	AccountTooNewBarrier,
	DefaultBarrier,
	NoPhoneNumberBarrier,
	NotMemberLongEnoughBarrier,
	SendMessageDisabledBarrier,
	TimeoutBarrier,
	UnclaimedAccountBarrier,
	UnverifiedEmailBarrier,
} from './barriers/BarrierComponents';

interface Props {
	channel: ChannelRecord;
}

export const VerificationBarrier = observer(({channel}: Props) => {
	const guildId = channel.guildId || '';
	const verificationStatus = GuildVerificationStore.getVerificationStatus(guildId);

	if (!verificationStatus || verificationStatus.canAccess) {
		return null;
	}

	switch (verificationStatus.reason) {
		case VerificationFailureReason.UNCLAIMED_ACCOUNT:
			return <UnclaimedAccountBarrier />;

		case VerificationFailureReason.UNVERIFIED_EMAIL:
			return <UnverifiedEmailBarrier />;

		case VerificationFailureReason.ACCOUNT_TOO_NEW:
			return <AccountTooNewBarrier initialTimeRemaining={verificationStatus.timeRemaining || 0} />;

		case VerificationFailureReason.NOT_MEMBER_LONG_ENOUGH:
			return <NotMemberLongEnoughBarrier initialTimeRemaining={verificationStatus.timeRemaining || 0} />;

		case VerificationFailureReason.NO_PHONE_NUMBER:
			return <NoPhoneNumberBarrier />;

		case VerificationFailureReason.SEND_MESSAGE_DISABLED:
			return <SendMessageDisabledBarrier />;

		case VerificationFailureReason.TIMED_OUT:
			return <TimeoutBarrier initialTimeRemaining={verificationStatus.timeRemaining || 0} />;

		default:
			return <DefaultBarrier />;
	}
});
