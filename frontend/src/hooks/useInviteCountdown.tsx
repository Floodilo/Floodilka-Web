/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';

export const useInviteCountdown = (
	expiresAt: string | null | undefined,
): {countdown: string | null; isMonospace: boolean} => {
	const [countdown, setCountdown] = React.useState<string | null>(null);
	const [isMonospace, setIsMonospace] = React.useState(false);

	React.useEffect(() => {
		if (!expiresAt) {
			setCountdown(null);
			setIsMonospace(false);
			return;
		}

		const updateTime = () => {
			const expiresAtTime = new Date(expiresAt).getTime();
			const now = Date.now();
			const remaining = expiresAtTime - now;

			if (remaining <= 0) {
				setCountdown('Expired');
				setIsMonospace(false);
				return;
			}

			const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
			const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

			const parts: Array<string> = [];
			if (days > 0) {
				parts.push(String(days).padStart(2, '0'));
			}
			parts.push(String(hours).padStart(2, '0'));
			parts.push(String(minutes).padStart(2, '0'));
			parts.push(String(seconds).padStart(2, '0'));

			setCountdown(parts.join(':'));
			setIsMonospace(true);
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);

		return () => clearInterval(interval);
	}, [expiresAt]);

	return {countdown, isMonospace};
};
