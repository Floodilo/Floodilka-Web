/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Plural, Trans} from '@lingui/react/macro';
import {GiftIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {Button} from '~/components/uikit/Button/Button';
import {ComponentDispatch} from '~/lib/ComponentDispatch';
import type {UserRecord} from '~/records/UserRecord';
import styles from './GiftInventoryBanner.module.css';

interface GiftInventoryBannerProps {
	currentUser: UserRecord;
}

export const GiftInventoryBanner: React.FC<GiftInventoryBannerProps> = observer(({currentUser}) => {
	if (!currentUser.hasUnreadGiftInventory) return null;

	return (
		<div className={styles.banner}>
			<div className={styles.content}>
				<GiftIcon className={styles.icon} weight="fill" />
				<div className={styles.textContainer}>
					<p className={styles.title}>
						<Plural
							value={currentUser.unreadGiftInventoryCount ?? 1}
							one="You have a new gift code waiting for you!"
							other="You have # new gift codes waiting for you!"
						/>
					</p>
				</div>
				<Button
					variant="inverted"
					small
					onClick={() => ComponentDispatch.dispatch('USER_SETTINGS_TAB_SELECT', {tab: 'gift_inventory'})}
				>
					<Trans>View Gift Inventory</Trans>
				</Button>
			</div>
		</div>
	);
});
