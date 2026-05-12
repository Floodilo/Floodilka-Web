/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {BookOpenIcon, WarningCircleIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {useSettingsContentKey} from '~/components/modals/hooks/useSettingsContentKey';
import {useUnsavedChangesFlash} from '~/components/modals/hooks/useUnsavedChangesFlash';
import {
	SettingsTabContainer,
	SettingsTabContent,
	SettingsTabSection,
} from '~/components/modals/shared/SettingsTabLayout';
import {StatusSlate} from '~/components/modals/shared/StatusSlate';
import {ApplicationCreateModal} from '~/components/modals/tabs/ApplicationsTab/ApplicationCreateModal';
import {ApplicationDetail} from '~/components/modals/tabs/ApplicationsTab/ApplicationDetail';
import {ApplicationsList} from '~/components/modals/tabs/ApplicationsTab/ApplicationsList';
import styles from '~/components/modals/tabs/ApplicationsTab/ApplicationsTab.module.css';
import ApplicationsTabStore from '~/components/modals/tabs/ApplicationsTab/ApplicationsTabStore';
import {Button} from '~/components/uikit/Button/Button';
import {Spinner} from '~/components/uikit/Spinner';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import type {DeveloperApplication} from '~/records/DeveloperApplicationRecord';
import UserStore from '~/stores/UserStore';

const ApplicationsTab: React.FC = observer(() => {
	const {t} = useLingui();
	const {checkUnsavedChanges} = useUnsavedChangesFlash('applications');
	const {setContentKey} = useSettingsContentKey();
	const store = ApplicationsTabStore;
	const isUnclaimed = !(UserStore.currentUser?.isClaimed() ?? false);

	React.useLayoutEffect(() => {
		setContentKey(store.contentKey);
	}, [store.contentKey, setContentKey]);

	React.useEffect(() => {
		void store.fetchApplications({showLoading: store.applications.length === 0});
	}, [store]);

	const handleSelectApplication = React.useCallback(
		(appId: string) => {
			if (checkUnsavedChanges()) return;
			void store.navigateToDetail(appId);
		},
		[store, checkUnsavedChanges],
	);

	const openCreateModal = React.useCallback(() => {
		ModalActionCreators.push(
			modal(() => (
				<ApplicationCreateModal
					onCreated={async (app: DeveloperApplication) => {
						await store.navigateToDetail(app.id, app);
						void store.fetchApplications({showLoading: false});
					}}
				/>
			)),
		);
	}, [store]);

	const handleBackToList = React.useCallback(() => {
		if (checkUnsavedChanges()) return;
		void store.navigateToList();
	}, [store, checkUnsavedChanges]);

	if (store.navigationState === 'LOADING_LIST' || (store.isLoading && store.isListView)) {
		return (
			<SettingsTabContainer>
				<SettingsTabContent>
					<div className={styles.spinnerContainer}>
						<Spinner />
					</div>
				</SettingsTabContent>
			</SettingsTabContainer>
		);
	}

	if (store.navigationState === 'ERROR' && store.isListView) {
		return (
			<SettingsTabContainer>
				<SettingsTabContent>
					<SettingsTabSection
						title={<Trans>Applications &amp; Bots</Trans>}
						description={<Trans>Manage your applications and bots.</Trans>}
					>
						<StatusSlate
							Icon={WarningCircleIcon}
							title={<Trans>Unable to load applications</Trans>}
							description={<Trans>Check your connection and try again.</Trans>}
							actions={[
								{
									text: <Trans>Retry</Trans>,
									onClick: () => store.fetchApplications({showLoading: true}),
								},
							]}
						/>
					</SettingsTabSection>
				</SettingsTabContent>
			</SettingsTabContainer>
		);
	}

	if (store.isDetailView && store.selectedAppId) {
		return (
			<SettingsTabContainer>
				<SettingsTabContent>
					<ApplicationDetail
						applicationId={store.selectedAppId}
						onBack={handleBackToList}
						initialApplication={store.selectedApplication}
					/>
				</SettingsTabContent>
			</SettingsTabContainer>
		);
	}

	return (
		<SettingsTabContainer>
			<SettingsTabContent>
				<SettingsTabSection
					title={<Trans>Applications &amp; Bots</Trans>}
					description={<Trans>Create and manage applications and bots for your account.</Trans>}
				>
					<div className={styles.buttonContainer}>
						{isUnclaimed ? (
							<Tooltip text={t`Claim your account to create applications.`}>
								<div>
									<Button variant="primary" fitContainer={false} fitContent onClick={openCreateModal} disabled>
										<Trans>Create Application</Trans>
									</Button>
								</div>
							</Tooltip>
						) : (
							<Button variant="primary" fitContainer={false} fitContent onClick={openCreateModal}>
								<Trans>Create Application</Trans>
							</Button>
						)}
						<Button
							variant="secondary"
							fitContainer={false}
							fitContent
							leftIcon={<BookOpenIcon size={16} weight="fill" />}
							onClick={() => window.open('https://docs.floodilka.com/topics/bots/', '_blank', 'noopener')}
						>
							<Trans>Documentation</Trans>
						</Button>
					</div>
					<ApplicationsList applications={store.applications} onSelectApplication={handleSelectApplication} />
				</SettingsTabSection>
			</SettingsTabContent>
		</SettingsTabContainer>
	);
});

export default ApplicationsTab;
