/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {ConfirmModal} from '~/components/modals/ConfirmModal';

interface SlowmodeRateLimitedModalProps {
	retryAfter: number;
}

export const SlowmodeRateLimitedModal = observer(({retryAfter}: SlowmodeRateLimitedModalProps) => {
	const {t} = useLingui();

	const formatTime = (seconds: number): string => {
		if (seconds < 60) {
			return seconds === 1 ? t`${seconds} second` : t`${seconds} seconds`;
		}

		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;

		if (remainingSeconds === 0) {
			return minutes === 1 ? t`${minutes} minute` : t`${minutes} minutes`;
		}

		if (minutes === 1 && remainingSeconds === 1) {
			return t`1 minute and 1 second`;
		}

		if (minutes === 1) {
			return t`1 minute and ${remainingSeconds} seconds`;
		}

		if (remainingSeconds === 1) {
			return t`${minutes} minutes and 1 second`;
		}

		return t`${minutes} minutes and ${remainingSeconds} seconds`;
	};

	return (
		<ConfirmModal
			title={t`Slowmode Active`}
			description={t(
				msg`This channel has slowmode enabled. You need to wait ${formatTime(retryAfter)} before sending another message.`,
			)}
			primaryText={t`Okay`}
			onPrimary={() => {}}
		/>
	);
});
