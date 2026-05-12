/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {WarningCircleIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type {FC} from 'react';
import {NSFWGateReason} from '~/stores/GuildNSFWAgreeStore';
import styles from './NSFWBlurOverlay.module.css';

interface NSFWBlurOverlayProps {
	reason: NSFWGateReason;
}

export const NSFWBlurOverlay: FC<NSFWBlurOverlayProps> = observer(({reason}) => {
	const getMessage = () => {
		switch (reason) {
			case NSFWGateReason.AGE_RESTRICTED:
				return <Trans>You must be 18 or older to view this content.</Trans>;
			default:
				return null;
		}
	};

	const message = getMessage();
	if (!message) return null;

	return (
		<div className={styles.warningContainer} style={{color: '#ff9933'}}>
			<WarningCircleIcon size={16} weight="fill" className={styles.warningIcon} />
			<span className={styles.warningText}>{message}</span>
		</div>
	);
});
