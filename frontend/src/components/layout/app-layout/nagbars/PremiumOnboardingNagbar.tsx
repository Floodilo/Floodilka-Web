/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import * as UserActionCreators from '~/actions/UserActionCreators';
import {Nagbar} from '~/components/layout/Nagbar';
import {NagbarButton} from '~/components/layout/NagbarButton';
import {NagbarContent} from '~/components/layout/NagbarContent';
import {UserSettingsModal} from '~/components/modals/UserSettingsModal';

export const PremiumOnboardingNagbar = observer(({isMobile}: {isMobile: boolean}) => {
	const handleOpenPremiumSettings = () => {
		void UserActionCreators.update({has_dismissed_premium_onboarding: true});
		ModalActionCreators.push(modal(() => <UserSettingsModal initialTab="premium" />));
	};

	const handleDismiss = () => {
		void UserActionCreators.update({has_dismissed_premium_onboarding: true});
	};

	return (
		<Nagbar
			isMobile={isMobile}
			backgroundColor="var(--brand-primary)"
			textColor="var(--text-on-brand-primary)"
			dismissible
			onDismiss={handleDismiss}
		>
			<NagbarContent
				isMobile={isMobile}
				message={
					<Trans>Welcome to Floodilka Premium! Explore your premium features and manage your subscription.</Trans>
				}
				actions={
					<>
						{isMobile && (
							<NagbarButton isMobile={isMobile} onClick={handleDismiss}>
								<Trans>Dismiss</Trans>
							</NagbarButton>
						)}
						<NagbarButton isMobile={isMobile} onClick={handleOpenPremiumSettings}>
							<Trans>View Premium Features</Trans>
						</NagbarButton>
					</>
				}
			/>
		</Nagbar>
	);
});
