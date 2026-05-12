/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {RateLimitedConfirmModal} from '~/components/alerts/RateLimitedConfirmModal';

interface MessageEditTooQuickModalProps {
	retryAfter?: number;
	onRetry?: () => void;
}

export const MessageEditTooQuickModal = observer(({retryAfter, onRetry}: MessageEditTooQuickModalProps) => {
	const {t} = useLingui();

	return (
		<RateLimitedConfirmModal title={t`You're editing messages too quickly`} retryAfter={retryAfter} onRetry={onRetry} />
	);
});
