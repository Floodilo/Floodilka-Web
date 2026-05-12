/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import styles from './KeyboardKey.module.css';

export const KeyboardKey = observer(({children}: {children: string}) => (
	<kbd className={clsx(styles.key, children === '↵' && styles.keyWide)}>{children}</kbd>
));
