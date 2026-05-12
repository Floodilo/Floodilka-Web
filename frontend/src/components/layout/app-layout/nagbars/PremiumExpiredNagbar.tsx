/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import * as NagbarActionCreators from '~/actions/NagbarActionCreators';
import {Nagbar} from '~/components/layout/Nagbar';
import {NagbarButton} from '~/components/layout/NagbarButton';
import {NagbarContent} from '~/components/layout/NagbarContent';
import {ComponentDispatch} from '~/lib/ComponentDispatch';
import UserStore from '~/stores/UserStore';

export const PremiumExpiredNagbar = observer(({isMobile}: {isMobile: boolean}) => {
	const user = UserStore.currentUser;

	const handleNavigateToPremium = () => {
		ComponentDispatch.dispatch('USER_SETTINGS_TAB_SELECT', {tab: 'premium'});
	};

	const handleDismiss = () => {
		NagbarActionCreators.dismissNagbar('premiumExpiredDismissed');
	};

	if (!user?.premiumUntil || user?.premiumWillCancel) return null;

	return (
		<Nagbar
			isMobile={isMobile}
			backgroundColor="var(--status-danger)"
			textColor="var(--text-on-brand-primary)"
			dismissible
			onDismiss={handleDismiss}
		>
			<NagbarContent
				isMobile={isMobile}
				message={
					<Trans>
						Your Premium subscription has expired. You've lost all Premium perks. Reactivate your subscription to
						regain access.
					</Trans>
				}
				actions={
					<>
						{isMobile && (
							<NagbarButton isMobile={isMobile} onClick={handleDismiss}>
								<Trans>Dismiss</Trans>
							</NagbarButton>
						)}
						<NagbarButton isMobile={isMobile} onClick={handleNavigateToPremium}>
							<Trans>Reactivate</Trans>
						</NagbarButton>
					</>
				}
			/>
		</Nagbar>
	);
});
