/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';
import styles from './ProfileCardFooter.module.css';

interface ProfileCardFooterProps {
	children: React.ReactNode;
}

export const ProfileCardFooter: React.FC<ProfileCardFooterProps> = observer(({children}) => {
	return <footer className={styles.footerSection}>{children}</footer>;
});
