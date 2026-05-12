/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type {FC} from 'react';
import styles from './GifIndicator.module.css';

export const GifIndicator: FC = observer(() => (
	<div className={styles.indicator} aria-hidden="true">
		GIF
	</div>
));
