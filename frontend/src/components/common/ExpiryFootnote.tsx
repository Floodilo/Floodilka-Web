/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import clsx from 'clsx';
import type {FC} from 'react';
import {getFormattedShortDate} from '~/utils/DateUtils';
import styles from './ExpiryFootnote.module.css';

export interface ExpiryFootnoteProps {
	expiresAt: Date | null;
	isExpired: boolean;
	label?: string;
	className?: string;
	inline?: boolean;
}

export const ExpiryFootnote: FC<ExpiryFootnoteProps> = ({expiresAt, isExpired, label, className, inline = false}) => {
	const {t} = useLingui();
	let resolved = label;
	if (!resolved) {
		if (expiresAt) {
			const date = getFormattedShortDate(expiresAt);
			resolved = isExpired ? t`Expired on ${date}` : t`Expires on ${date}`;
		} else {
			return null;
		}
	}

	return (
		<span className={clsx(inline ? styles.inlineFootnote : styles.footnote, className)}>
			{resolved}
		</span>
	);
};
