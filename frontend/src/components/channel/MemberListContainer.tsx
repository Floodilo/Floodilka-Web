/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';
import type {UIEvent} from 'react';
import {Scroller} from '~/components/uikit/Scroller';
import styles from './MemberListContainer.module.css';

interface MemberListContainerProps {
	channelId: string;
	children: React.ReactNode;
	onScroll?: (event: UIEvent<HTMLDivElement>) => void;
}

export const MemberListContainer: React.FC<MemberListContainerProps> = observer(({channelId, children, onScroll}) => {
	return (
		<div className={styles.memberListContainer}>
			<Scroller className={styles.memberListScroller} key={`member-list-scroller-${channelId}`} onScroll={onScroll}>
				<div className={styles.scrollerSpacer} />
				{children}
			</Scroller>
		</div>
	);
});
