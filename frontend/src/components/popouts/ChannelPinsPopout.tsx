/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {PushPinIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import {ChannelPinsContent} from '~/components/shared/ChannelPinsContent';
import type {ChannelRecord} from '~/records/ChannelRecord';
import styles from './ChannelPinsPopout.module.css';

export const ChannelPinsPopout = observer(({channel}: {channel: ChannelRecord}) => {
	const {t} = useLingui();
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<PushPinIcon className={styles.iconLarge} />
				<h1 className={styles.title}>{t`Pinned Messages`}</h1>
			</div>
			<div className={styles.body}>
				<ChannelPinsContent channel={channel} />
			</div>
		</div>
	);
});
