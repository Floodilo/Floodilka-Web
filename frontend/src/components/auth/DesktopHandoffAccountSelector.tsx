/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {useCallback, useState} from 'react';
import * as AuthenticationActionCreators from '~/actions/AuthenticationActionCreators';
import {AccountSelector} from '~/components/accounts/AccountSelector';
import {HandoffCodeDisplay} from '~/components/auth/HandoffCodeDisplay';
import {SessionExpiredError} from '~/lib/SessionManager';
import AccountManager, {type AccountSummary} from '~/stores/AccountManager';

type HandoffState = 'selecting' | 'generating' | 'displaying' | 'error';

interface DesktopHandoffAccountSelectorProps {
	excludeCurrentUser?: boolean;
	onSelectNewAccount: () => void;
}

const DesktopHandoffAccountSelector = observer(function DesktopHandoffAccountSelector({
	excludeCurrentUser = false,
	onSelectNewAccount,
}: DesktopHandoffAccountSelectorProps) {
	const {t} = useLingui();
	const [handoffState, setHandoffState] = useState<HandoffState>('selecting');
	const [handoffCode, setHandoffCode] = useState<string | null>(null);
	const [handoffError, setHandoffError] = useState<string | null>(null);
	const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

	const currentUserId = AccountManager.currentUserId;
	const allAccounts = AccountManager.orderedAccounts;
	const accounts = excludeCurrentUser ? allAccounts.filter((account) => account.userId !== currentUserId) : allAccounts;
	const isGenerating = handoffState === 'generating';

	const handleSelectAccount = useCallback(async (account: AccountSummary) => {
		setSelectedAccountId(account.userId);
		setHandoffState('generating');
		setHandoffError(null);

		try {
			const {token, userId} = await AccountManager.generateTokenForAccount(account.userId);
			if (!token) {
				throw new Error('Failed to generate token');
			}

			const result = await AuthenticationActionCreators.initiateDesktopHandoff();
			await AuthenticationActionCreators.completeDesktopHandoff({
				code: result.code,
				token,
				userId,
			});

			setHandoffCode(result.code);
			setHandoffState('displaying');
		} catch (error) {
			setHandoffState('error');
			if (error instanceof SessionExpiredError) {
				setHandoffError(t`Session expired. Please log in again.`);
			} else {
				setHandoffError(error instanceof Error ? error.message : t`Failed to generate handoff code`);
			}
		}
	}, []);

	const handleRetry = useCallback(() => {
		if (selectedAccountId) {
			const account = allAccounts.find((a) => a.userId === selectedAccountId);
			if (account) {
				void handleSelectAccount(account);
				return;
			}
		}
		setHandoffState('selecting');
		setSelectedAccountId(null);
		setHandoffError(null);
	}, [selectedAccountId, allAccounts, handleSelectAccount]);

	if (handoffState === 'generating' || handoffState === 'displaying' || handoffState === 'error') {
		return (
			<HandoffCodeDisplay
				code={handoffCode}
				isGenerating={handoffState === 'generating'}
				error={handoffState === 'error' ? handoffError : null}
				onRetry={handleRetry}
			/>
		);
	}

	return (
		<AccountSelector
			accounts={accounts}
			title={<Trans>Choose an account</Trans>}
			description={<Trans>Select the account you want to sign in with on the desktop app.</Trans>}
			disabled={isGenerating}
			showInstance
			clickableRows
			onSelectAccount={handleSelectAccount}
			onAddAccount={onSelectNewAccount}
			addButtonLabel={<Trans>Add a different account</Trans>}
			scrollerKey="desktop-handoff-scroller"
		/>
	);
});

export default DesktopHandoffAccountSelector;
