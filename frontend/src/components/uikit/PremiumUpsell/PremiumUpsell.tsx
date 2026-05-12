/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {CrownIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import type React from 'react';
import * as PremiumModalActionCreators from '~/actions/PremiumModalActionCreators';
import {Button} from '~/components/uikit/Button/Button';
import styles from './PremiumUpsell.module.css';

interface PremiumUpsellProps {
	children: React.ReactNode;
	className?: string;
	buttonText?: React.ReactNode;
	onButtonClick?: () => void;
	dismissible?: boolean;
	onDismiss?: () => void;
}

export const PremiumUpsell: React.FC<PremiumUpsellProps> = ({
	children,
	className,
	buttonText,
	onButtonClick,
	dismissible,
	onDismiss,
}) => {
	const {t} = useLingui();
	return (
		<div className={clsx(styles.upsell, className)}>
			<CrownIcon size={16} weight="fill" className={styles.icon} />
			<div className={styles.content}>
				<p className={styles.text}>{children}</p>
				<div className={styles.actions}>
					<Button
						variant="inverted"
						superCompact={true}
						fitContent={true}
						onClick={onButtonClick ?? (() => PremiumModalActionCreators.open())}
						aria-label={t`Get Premium`}
					>
						{buttonText ?? <Trans>Get Premium</Trans>}
					</Button>
					{dismissible && onDismiss && (
						<button type="button" className={styles.dismissLink} onClick={onDismiss}>
							<Trans>Don't show this again</Trans>
						</button>
					)}
				</div>
			</div>
		</div>
	);
};
