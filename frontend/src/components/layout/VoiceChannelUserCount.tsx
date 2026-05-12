/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import styles from './VoiceChannelUserCount.module.css';

interface VoiceChannelUserCountProps {
	currentUserCount: number;
	userLimit: number;
}

export const VoiceChannelUserCount = observer(function VoiceChannelUserCount({
	currentUserCount,
	userLimit,
}: VoiceChannelUserCountProps) {
	return (
		<div className={styles.wrapper}>
			<span className={styles.users}>{currentUserCount.toString().padStart(2, '0')}</span>
			<span className={styles.total}>{userLimit.toString().padStart(2, '0')}</span>
		</div>
	);
});
