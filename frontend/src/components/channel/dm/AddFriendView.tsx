/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {UserCirclePlus} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import {AddFriendForm} from './AddFriendForm';
import styles from './AddFriendView.module.css';

export const AddFriendView = observer(() => {
	return (
		<div className={styles.addFriendContainer}>
			<div className={styles.card}>
				<UserCirclePlus weight="fill" className={styles.heroIcon} />
				<h2 className={styles.title}>
					<Trans>Add Friend</Trans>
				</h2>
				<p className={styles.subtitle}>
					<Trans>You can add friends with their username.</Trans>
				</p>
				<div className={styles.formContainer}>
					<AddFriendForm />
				</div>
			</div>
		</div>
	);
});
