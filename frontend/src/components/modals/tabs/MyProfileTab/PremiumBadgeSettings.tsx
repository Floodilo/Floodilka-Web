/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {t} from '@lingui/core/macro';
import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {Switch} from '~/components/form/Switch';
import * as DateUtils from '~/utils/DateUtils';
import styles from './PremiumBadgeSettings.module.css';

interface PremiumBadgeSettingsProps {
	premiumBadgeHidden: boolean;
	premiumBadgeTimestampHidden: boolean;
	onToggle: (
		field:
			| 'premium_badge_hidden'
			| 'premium_badge_timestamp_hidden',
		value: boolean,
	) => void;
	premiumSince?: Date | null;
}

export const PremiumBadgeSettings = observer(
	({
		premiumBadgeHidden,
		premiumBadgeTimestampHidden,
		onToggle,
		premiumSince,
	}: PremiumBadgeSettingsProps) => {
		const {i18n} = useLingui();

		return (
			<div>
				<div className={styles.header}>
					<h2 className={styles.title}>
						<Trans>Premium Badge Privacy</Trans>
					</h2>
					<p className={styles.description}>
						<Trans>Control how your Premium badge is displayed to others</Trans>
					</p>
				</div>

				<div className={styles.switches}>
					<Switch
						label={t(i18n)`Hide Premium badge entirely`}
						description={t(i18n)`Completely hide your Premium badge from other users`}
						value={premiumBadgeHidden}
						onChange={(value) => onToggle('premium_badge_hidden', value)}
					/>

					<Switch
						label={
							premiumSince
								? t(i18n)`Hide Premium purchase date (${DateUtils.getFormattedShortDate(premiumSince)})`
								: t(i18n)`Hide Premium purchase date`
						}
						description={t(i18n)`Remove when you first bought Premium from your badge`}
						value={premiumBadgeTimestampHidden}
						onChange={(value) => onToggle('premium_badge_timestamp_hidden', value)}
						disabled={premiumBadgeHidden}
					/>
				</div>
			</div>
		);
	},
);
