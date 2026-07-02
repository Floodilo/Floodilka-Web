/*
 * Copyright (C) 2026 Floodilka Contributors
 *
 * This file is part of Floodilka.
 *
 * Floodilka is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Floodilka is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Floodilka. If not, see <https://www.gnu.org/licenses/>.
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import {PremiumContent} from '~/components/modals/components/PremiumContent';
import {
	shouldShowUserPremiumBilling,
	useSubscriptionStatus,
} from '~/components/modals/components/premium/hooks/useSubscriptionStatus';
import {Scroller} from '~/components/uikit/Scroller';
import {Routes} from '~/Routes';
import UserStore from '~/stores/UserStore';
import * as RouterUtils from '~/utils/RouterUtils';
import premiumBlob from '~/images/premium-blob.png';
import styles from './PremiumPage.module.css';

interface PremiumPageProps {
	view?: 'promo' | 'billing';
}

export const PremiumPage = observer(({view = 'promo'}: PremiumPageProps) => {
	const currentUser = UserStore.currentUser;
	const subscriptionStatus = useSubscriptionStatus(currentUser);

	React.useLayoutEffect(() => {
		if (view === 'billing' && !shouldShowUserPremiumBilling(currentUser)) {
			RouterUtils.transitionTo(Routes.ME_PREMIUM);
		}
	}, [view, currentUser]);

	const showDecorativeBlob = view === 'promo' && !subscriptionStatus.shouldShowPremiumCard;

	return (
		<div className={styles.root}>
			{showDecorativeBlob ? (
				<img className={styles.decorativeBlob} src={premiumBlob} alt="" aria-hidden />
			) : null}
			<div className={styles.contentStack}>
				<Scroller key="premium-page-scroller">
					<div className={styles.scrollInner}>
						<PremiumContent view={view} />
					</div>
				</Scroller>
			</div>
		</div>
	);
});
