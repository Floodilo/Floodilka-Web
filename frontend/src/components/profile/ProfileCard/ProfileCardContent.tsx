/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import styles from './ProfileCardContent.module.css';

interface ProfileCardContentProps {
	children: React.ReactNode;
	isWebhook?: boolean;
}

export const ProfileCardContent: React.FC<ProfileCardContentProps> = observer(({children, isWebhook = false}) => {
	return <div className={clsx(styles.contentSection, isWebhook && styles.contentSectionWebhook)}>{children}</div>;
});
