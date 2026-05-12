/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {ConfirmModal} from '~/components/modals/ConfirmModal';

interface RateLimitedConfirmModalProps {
	title: string;
	retryAfter?: number;
	onRetry?: () => void;
}

export const RateLimitedConfirmModal = observer(({title, retryAfter, onRetry}: RateLimitedConfirmModalProps) => {
	const {t} = useLingui();
	const hasRetryAfter = retryAfter != null;

	const formatRateLimitTime = React.useCallback(
		(totalSeconds: number): string => {
			if (totalSeconds < 60) {
				return totalSeconds === 1 ? t`${totalSeconds} second` : t`${totalSeconds} seconds`;
			}

			const minutes = Math.floor(totalSeconds / 60);
			const seconds = totalSeconds % 60;

			if (seconds === 0) {
				return minutes === 1 ? t`${minutes} minute` : t`${minutes} minutes`;
			}

			if (minutes === 1 && seconds === 1) {
				return t`1 minute and 1 second`;
			}

			if (minutes === 1) {
				return t`1 minute and ${seconds} seconds`;
			}

			if (seconds === 1) {
				return t`${minutes} minutes and 1 second`;
			}

			return t`${minutes} minutes and ${seconds} seconds`;
		},
		[t],
	);

	return (
		<ConfirmModal
			title={title}
			description={
				hasRetryAfter
					? t`You're being rate limited. Please wait ${formatRateLimitTime(retryAfter)} before trying again.`
					: t`The problem with being faster than light is that you can only live in darkness. Take a breather and try again.`
			}
			secondaryText={hasRetryAfter ? t`Retry` : t`Gotcha`}
			onSecondary={onRetry}
		/>
	);
});
