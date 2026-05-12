/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import React from 'react';
import * as GuildActionCreators from '~/actions/GuildActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {GenericErrorModal} from '~/components/alerts/GenericErrorModal';
import {ConfirmModal} from '~/components/modals/ConfirmModal';
import {Routes} from '~/Routes';
import * as RouterUtils from '~/utils/RouterUtils';

export const useLeaveGuild = () => {
	const {t} = useLingui();

	return React.useCallback(
		(guildId: string) => {
			ModalActionCreators.push(
				modal(() => (
					<ConfirmModal
						title={t`Leave Community`}
						description={t`Are you sure you want to leave this community? You will no longer be able to see any messages.`}
						primaryText={t`Leave Community`}
						primaryVariant="danger-primary"
						onPrimary={async () => {
							try {
								await GuildActionCreators.leave(guildId);
								RouterUtils.transitionTo(Routes.ME);
								ToastActionCreators.createToast({
									type: 'success',
									children: t`Left community`,
								});
							} catch (error) {
								console.error('Failed to leave community:', error);
								ModalActionCreators.push(
									modal(() => (
										<GenericErrorModal
											title={t`Failed to leave community`}
											message={t`We couldn't remove you from the community at this time.`}
										/>
									)),
								);
							}
						}}
					/>
				)),
			);
		},
		[t],
	);
};
