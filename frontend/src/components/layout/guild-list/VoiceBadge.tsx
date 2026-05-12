/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {SpeakerHighIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import type React from 'react';
import guildStyles from '../GuildsLayout.module.css';

interface VoiceBadgeProps {
	className?: string;
}

export const VoiceBadge: React.FC<VoiceBadgeProps> = ({className}) => (
	<div className={clsx(guildStyles.guildVoiceBadge, className)}>
		<div className={guildStyles.guildVoiceBadgeInner}>
			<SpeakerHighIcon weight="fill" className={guildStyles.guildVoiceBadgeIcon} />
		</div>
	</div>
);
