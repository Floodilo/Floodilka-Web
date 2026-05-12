/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {RateLimitedConfirmModal} from '~/components/alerts/RateLimitedConfirmModal';

interface MessageSendTooQuickModalProps {
	retryAfter?: number;
	onRetry?: () => void;
}

export const MessageSendTooQuickModal = observer(({retryAfter, onRetry}: MessageSendTooQuickModalProps) => {
	const {t} = useLingui();

	return (
		<RateLimitedConfirmModal title={t`You're sending messages too quickly`} retryAfter={retryAfter} onRetry={onRetry} />
	);
});
