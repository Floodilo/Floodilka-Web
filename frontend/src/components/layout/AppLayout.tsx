/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as AuthenticationActionCreators from '~/actions/AuthenticationActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {SplashScreen} from '~/components/layout/SplashScreen';
import RequiredActionModal from '~/components/modals/RequiredActionModal';
import {NewDeviceMonitoringManager} from '~/components/voice/NewDeviceMonitoringManager';
import {VoiceReconnectionManager} from '~/components/voice/VoiceReconnectionManager';
import AccountManager from '~/stores/AccountManager';
import AuthenticationStore from '~/stores/AuthenticationStore';
import ConnectionStore from '~/stores/ConnectionStore';
import InitializationStore from '~/stores/InitializationStore';
import ModalStore from '~/stores/ModalStore';
import UserStore from '~/stores/UserStore';
import styles from './AppLayout.module.css';
import {useAppLayoutState} from './app-layout/hooks';

export const AppLayout = observer(({children}: {children: React.ReactNode}) => {
	const isAuthenticated = AuthenticationStore.isAuthenticated;
	const socket = ConnectionStore.socket;
	const user = UserStore.currentUser;

	const appState = useAppLayoutState();

	React.useEffect(() => {
		if (InitializationStore.isLoading) {
			return;
		}
		void AuthenticationActionCreators.ensureSessionStarted();
	}, [
		isAuthenticated,
		socket,
		ConnectionStore.isConnected,
		ConnectionStore.isConnecting,
		InitializationStore.isLoading,
		AccountManager.isSwitching,
	]);

	React.useEffect(() => {
		const hasRequired = !!(user?.requiredActions && user.requiredActions.length > 0);
		const isOpen = ModalStore.getModal()?.key === 'required-actions';
		if (hasRequired && !isOpen) {
			ModalActionCreators.pushWithKey(
				modal(() => <RequiredActionModal mock={false} />),
				'required-actions',
			);
		}
		if (!hasRequired && isOpen) {
			ModalActionCreators.pop();
		}
	}, [user?.requiredActions?.length]);

	return (
		<>
			{isAuthenticated && <SplashScreen />}

			{isAuthenticated && socket && <VoiceReconnectionManager />}
			{isAuthenticated && <NewDeviceMonitoringManager />}
			<div className={clsx(styles.appLayout, appState.isStandalone && styles.appLayoutStandalone)}>{children}</div>
		</>
	);
});
