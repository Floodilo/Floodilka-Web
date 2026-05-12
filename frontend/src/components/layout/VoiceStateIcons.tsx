/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {MicrophoneSlashIcon, SpeakerSlashIcon, VideoCameraIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import styles from './VoiceStateIcons.module.css';

interface Props {
	isSelfMuted: boolean;
	isSelfDeafened: boolean;
	isGuildMuted: boolean;
	isGuildDeafened: boolean;
	isCameraOn?: boolean;
	isScreenSharing?: boolean;
	className?: string;
}

export const VoiceStateIcons = observer(
	({isSelfMuted, isSelfDeafened, isGuildMuted, isGuildDeafened, isCameraOn, isScreenSharing, className}: Props) => {
		const {t} = useLingui();
		return (
			<div className={clsx(styles.container, className)}>
				{isScreenSharing && (
					<Tooltip text={t`Screen Sharing`}>
						<span className={styles.liveBadge}>{t`Live`}</span>
					</Tooltip>
				)}
				{isCameraOn && (
					<Tooltip text={t`Camera On`}>
						<VideoCameraIcon weight="fill" className={clsx(styles.icon, styles.iconMuted)} />
					</Tooltip>
				)}
				{(isGuildMuted || isSelfMuted) && (
					<Tooltip text={isGuildMuted ? t`Community Muted` : t`Muted`}>
						<MicrophoneSlashIcon
							weight="fill"
							className={clsx(styles.icon, isGuildMuted ? styles.iconGuildAction : styles.iconMuted)}
						/>
					</Tooltip>
				)}
				{(isGuildDeafened || isSelfDeafened) && (
					<Tooltip text={isGuildDeafened ? t`Community Deafened` : t`Deafened`}>
						<SpeakerSlashIcon
							weight="fill"
							className={clsx(styles.icon, isGuildDeafened ? styles.iconGuildAction : styles.iconMuted)}
						/>
					</Tooltip>
				)}
			</div>
		);
	},
);
