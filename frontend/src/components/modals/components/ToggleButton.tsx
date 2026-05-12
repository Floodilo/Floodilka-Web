/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import styles from './ToggleButton.module.css';

export const ToggleButton: React.FC<{active: boolean; onClick: () => void; label: string}> = observer(
	({active, onClick, label}) => (
		<button
			type="button"
			aria-pressed={active}
			className={clsx(styles.button, active ? styles.active : styles.inactive)}
			onClick={onClick}
		>
			{label}
		</button>
	),
);
