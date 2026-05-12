/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {I18n} from '@lingui/core';
import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {ConfirmModal} from '~/components/modals/ConfirmModal';
import {Logger} from '~/lib/Logger';
import NotificationStore from '~/stores/NotificationStore';

const logger = new Logger('Notification');

export const permissionDenied = (i18n: I18n, suppressModal = false): void => {
	logger.debug('Notification permission denied');
	NotificationStore.handleNotificationPermissionDenied();

	if (suppressModal) return;

	ModalActionCreators.push(
		modal(() => (
			<ConfirmModal
				title={i18n._(msg`Notifications Blocked`)}
				description={
					<p>
						<Trans>
							Desktop notifications have been blocked. You can enable them later in your browser settings or in User
							Settings &gt; Notifications.
						</Trans>
					</p>
				}
				primaryText={i18n._(msg`OK`)}
				primaryVariant="primary"
				secondaryText={false}
				onPrimary={() => {}}
			/>
		)),
	);
};

export const permissionGranted = (): void => {
	logger.debug('Notification permission granted');
	NotificationStore.handleNotificationPermissionGranted();
};

export const toggleUnreadMessageBadge = (enabled: boolean): void => {
	NotificationStore.handleNotificationSoundToggle(enabled);
};
