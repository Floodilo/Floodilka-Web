/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import {ExternalLink} from '~/components/common/ExternalLink';
import {Routes} from '~/Routes';
import styles from './PurchaseDisclaimer.module.css';

export const PurchaseDisclaimer = observer(
	({isPremium = false, align = 'center'}: {isPremium?: boolean; align?: 'left' | 'center'}) => (
		<p className={clsx(styles.disclaimer, align === 'center' ? styles.center : styles.left)}>
			{isPremium ? (
				<Trans>
					By purchasing, you agreed to our <ExternalLink href={Routes.terms()}>Terms of Service</ExternalLink> and{' '}
					<ExternalLink href={Routes.privacy()}>Privacy Policy</ExternalLink>. All purchases are refundable within 14
					days by emailing <ExternalLink href="mailto:help@floodilka.com">help@floodilka.com</ExternalLink>. Chargebacks
					result in permanent account bans — if you want a refund, we're more than happy to give you one if you contact
					us first! Payment information is securely handled by CloudPayments — we never have access to your full card number.
				</Trans>
			) : (
				<Trans>
					By purchasing, you agree to our <ExternalLink href={Routes.terms()}>Terms of Service</ExternalLink> and{' '}
					<ExternalLink href={Routes.privacy()}>Privacy Policy</ExternalLink>. All purchases are refundable within 14
					days by emailing <ExternalLink href="mailto:help@floodilka.com">help@floodilka.com</ExternalLink>. Chargebacks
					result in permanent account bans — if you want a refund, we're more than happy to give you one if you contact
					us first! Payment information is securely handled by CloudPayments — we never have access to your full card number.
				</Trans>
			)}
		</p>
	),
);
