/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import type React from 'react';
import styles from '../ChannelIndexPage.module.css';

interface ChannelViewScaffoldProps {
	header: React.ReactNode;
	chatArea: React.ReactNode;
	sidePanel?: React.ReactNode | null;
	showMemberListDivider?: boolean;
	className?: string;
}

export const ChannelViewScaffold: React.FC<ChannelViewScaffoldProps> = ({
	header,
	chatArea,
	sidePanel = null,
	showMemberListDivider = false,
	className,
}) => {
	return (
		<div className={clsx(styles.channelGrid, sidePanel && styles.channelGridWithSidePanel, className)}>
			<div className={styles.chatBlock}>
				{header}
				{chatArea}
			</div>
			{sidePanel && <div className={styles.sidePanelBlock}>{sidePanel}</div>}
		</div>
	);
};
