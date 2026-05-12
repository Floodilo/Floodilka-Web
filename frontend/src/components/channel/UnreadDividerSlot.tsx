/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import dividerStyles from './Divider.module.css';
import styles from './Messages.module.css';

type UnreadDividerSlotProps =
	| {beforeId: string; afterId?: never; visible: boolean}
	| {afterId: string; beforeId?: never; visible: boolean};

export const UnreadDividerSlot = observer(function UnreadDividerSlot(props: UnreadDividerSlotProps) {
	const data: Record<string, string> = {'data-divider-slot': 'unread'};
	if ('beforeId' in props && props.beforeId !== undefined) data['data-before-id'] = props.beforeId;
	if ('afterId' in props && props.afterId !== undefined) data['data-after-id'] = props.afterId;

	return (
		<div
			className={styles.unreadSlot}
			aria-hidden="true"
			id={props.visible ? 'new-messages-bar' : undefined}
			data-visible={props.visible ? '1' : undefined}
			{...(data as any)}
		>
			<div className={dividerStyles.unreadContainer}>
				<div className={dividerStyles.unreadLine} />
				<span className={dividerStyles.unreadBadge}>
					<Trans>New</Trans>
				</span>
			</div>
		</div>
	);
});
