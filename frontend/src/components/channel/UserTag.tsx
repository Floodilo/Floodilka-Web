/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {clsx} from 'clsx';
import React from 'react';
import styles from './UserTag.module.css';

interface UserTagProps extends React.ComponentPropsWithoutRef<'span'> {
	className?: string;
	system?: boolean;
	size?: 'sm' | 'lg';
}

export const UserTag = React.forwardRef<HTMLSpanElement, UserTagProps>(
	({className, system, size = 'sm', ...props}, ref) => {
		return (
			<span className={clsx(styles.tag, size === 'lg' ? styles.tagLg : styles.tagSm, className)} ref={ref} {...props}>
				<span className={clsx(styles.text, size === 'lg' ? styles.textLg : styles.textSm)}>
					{system ? <Trans>System</Trans> : <Trans>Bot</Trans>}
				</span>
			</span>
		);
	},
);

UserTag.displayName = 'UserTag';
