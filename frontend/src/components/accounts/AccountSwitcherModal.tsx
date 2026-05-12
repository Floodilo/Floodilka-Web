/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {PlusIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import {Scroller} from '~/components/uikit/Scroller';
import {Spinner} from '~/components/uikit/Spinner';
import {openAccountContextMenu, useAccountSwitcherLogic} from '~/utils/accounts/AccountSwitcherModalUtils';
import {AccountRow} from './AccountRow';
import styles from './AccountSwitcherModal.module.css';

const AccountSwitcherModal = observer(() => {
	const {
		accounts,
		currentAccount,
		isBusy,
		handleSwitchAccount,
		handleReLogin,
		handleAddAccount,
		handleLogout,
		handleRemoveAccount,
	} = useAccountSwitcherLogic();

	const hasMultipleAccounts = accounts.length > 1;

	const openMenu = React.useCallback(
		(account: (typeof accounts)[number]) => (event: React.MouseEvent<HTMLButtonElement>) => {
			event.preventDefault();
			event.stopPropagation();

			openAccountContextMenu(event, {
				account,
				currentAccountId: currentAccount?.userId ?? null,
				hasMultipleAccounts,
				onSwitch: handleSwitchAccount,
				onReLogin: handleReLogin,
				onLogout: handleLogout,
				onRemoveAccount: handleRemoveAccount,
			});
		},
		[
			currentAccount?.userId,
			hasMultipleAccounts,
			handleSwitchAccount,
			handleReLogin,
			handleLogout,
			handleRemoveAccount,
		],
	);

	return (
		<Modal.Root size="small" centered>
			<Modal.Header title={<Trans>Manage Accounts</Trans>} />
			<Modal.Content className={styles.content}>
				{isBusy && accounts.length === 0 ? (
					<div className={styles.loadingContainer}>
						<Spinner />
					</div>
				) : accounts.length === 0 ? (
					<div className={styles.noAccounts}>
						<Trans>No accounts</Trans>
					</div>
				) : (
					<Scroller className={styles.scroller} key="account-switcher-scroller">
						<div className={styles.accountList}>
							{accounts.map((account) => {
								const isCurrent = account.userId === currentAccount?.userId;
								return (
									<AccountRow
										key={account.userId}
										account={account}
										variant="manage"
										isCurrent={isCurrent}
										isExpired={account.isValid === false}
										showInstance
										onMenuClick={openMenu(account)}
									/>
								);
							})}
						</div>
					</Scroller>
				)}
			</Modal.Content>
			<Modal.Footer className={styles.footer}>
				<Button
					variant="secondary"
					leftIcon={<PlusIcon size={18} weight="bold" />}
					onClick={handleAddAccount}
					disabled={isBusy}
					fitContainer
				>
					<Trans>Add an account</Trans>
				</Button>
			</Modal.Footer>
		</Modal.Root>
	);
});

export default AccountSwitcherModal;
