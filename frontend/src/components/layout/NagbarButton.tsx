/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import type React from 'react';
import {Button} from '~/components/uikit/Button/Button';
import styles from './NagbarButton.module.css';

interface NagbarButtonProps {
	children: React.ReactNode;
	onClick: () => void;
	isMobile: boolean;
	className?: string;
	disabled?: boolean;
	submitting?: boolean;
}

export const NagbarButton = ({
	children,
	onClick,
	isMobile,
	className,
	disabled = false,
	submitting,
}: NagbarButtonProps) => {
	return (
		<Button
			variant="inverted-outline"
			superCompact={!isMobile}
			compact={isMobile}
			fitContent
			className={clsx(styles.button, className)}
			onClick={onClick}
			disabled={disabled}
			submitting={submitting}
		>
			{children}
		</Button>
	);
};
