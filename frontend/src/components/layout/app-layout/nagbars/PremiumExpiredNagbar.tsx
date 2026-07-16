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

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import * as NagbarActionCreators from '~/actions/NagbarActionCreators';
import {Nagbar} from '~/components/layout/Nagbar';
import {NagbarButton} from '~/components/layout/NagbarButton';
import {NagbarContent} from '~/components/layout/NagbarContent';
import {UserSettingsModal} from '~/components/modals/UserSettingsModal';
import UserStore from '~/stores/UserStore';

export const PremiumExpiredNagbar = observer(({isMobile}: {isMobile: boolean}) => {
	const user = UserStore.currentUser;

	const handleNavigateToPremium = () => {
		ModalActionCreators.push(modal(() => <UserSettingsModal initialTab="premium" />));
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
						Your Premium subscription has expired. You've lost all Premium perks. Reactivate your subscription to regain
						access.
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
