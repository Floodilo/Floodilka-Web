/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import React from 'react';
import * as ChannelActionCreators from '~/actions/ChannelActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {ME} from '~/Constants';
import {GroupLeaveFailedModal} from '~/components/alerts/GroupLeaveFailedModal';
import {ConfirmModal} from '~/components/modals/ConfirmModal';
import {Checkbox} from '~/components/uikit/Checkbox/Checkbox';
import {Routes} from '~/Routes';
import SelectedChannelStore from '~/stores/SelectedChannelStore';
import * as RouterUtils from '~/utils/RouterUtils';

export const useLeaveGroup = () => {
	const {t} = useLingui();

	return React.useCallback(
		(channelId: string) => {
			ModalActionCreators.push(
				modal(() => (
					<ConfirmModal
						title={t`Leave Group`}
						description={t`Are you sure you want to leave this group? You will no longer be able to see any messages.`}
						primaryText={t`Leave Group`}
						primaryVariant="danger-primary"
						checkboxContent={<Checkbox>{t`Leave without notifying other members`}</Checkbox>}
						onPrimary={async (checkboxChecked = false) => {
							try {
								await ChannelActionCreators.remove(channelId, checkboxChecked);
								const selectedChannel = SelectedChannelStore.selectedChannelIds.get(ME);
								if (selectedChannel === channelId) {
									RouterUtils.transitionTo(Routes.ME);
								}
								ToastActionCreators.createToast({
									type: 'success',
									children: t`Left group`,
								});
							} catch (error) {
								console.error('Failed to leave group:', error);
								ModalActionCreators.push(modal(() => <GroupLeaveFailedModal />));
							}
						}}
					/>
				)),
			);
		},
		[t],
	);
};
