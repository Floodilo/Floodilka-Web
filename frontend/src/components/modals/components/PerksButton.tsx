/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import styles from './PerksButton.module.css';

export const PerksButton: React.FC<{
	onClick: () => void;
	onKeyDown: (event: React.KeyboardEvent<HTMLSpanElement>) => void;
}> = observer(({onClick, onKeyDown}) => (
	<span role="link" tabIndex={0} onClick={onClick} onKeyDown={onKeyDown} className={styles.link}>
		<Trans>Premium perks</Trans>
	</span>
));
