/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import styles from './DropIndicator.module.css';

export const DropIndicator = observer(({position, isValid = true}: {position: 'top' | 'bottom'; isValid?: boolean}) => (
	<div
		className={clsx(
			styles.dropIndicator,
			position === 'top' ? styles.dropIndicatorTop : styles.dropIndicatorBottom,
			isValid ? styles.dropIndicatorValid : styles.dropIndicatorInvalid,
		)}
	/>
));
