/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {openClaimAccountModal} from '~/components/modals/ClaimAccountModal';
import {EmailChangeModal} from '~/components/modals/EmailChangeModal';
import {PasswordChangeModal} from '~/components/modals/PasswordChangeModal';
import {SettingsTabSection} from '~/components/modals/shared/SettingsTabLayout';
import {Button} from '~/components/uikit/Button/Button';
import type {UserRecord} from '~/records/UserRecord';
import * as DateUtils from '~/utils/DateUtils';
import {EmailVerificationAlert} from '../../components/EmailVerificationAlert';
import {UnclaimedAccountAlert} from '../../components/UnclaimedAccountAlert';
import styles from './AccountTab.module.css';

const maskEmail = (email: string): string => {
	const [username, domain] = email.split('@');
	const maskedUsername = username.replace(/./g, '*');
	return `${maskedUsername}@${domain}`;
};

interface AccountTabProps {
	user: UserRecord;
	isClaimed: boolean;
	showMaskedEmail: boolean;
	setShowMaskedEmail: (show: boolean) => void;
}

export const AccountTabContent: React.FC<AccountTabProps> = observer(
	({user, isClaimed, showMaskedEmail, setShowMaskedEmail}) => {
		const {t, i18n} = useLingui();
		return (
			<>
				{!isClaimed && <UnclaimedAccountAlert />}

				<SettingsTabSection>
					{isClaimed ? (
						<>
							<div className={styles.row}>
								<div className={styles.rowContent}>
									<div className={styles.label}>
										<Trans>Email Address</Trans>
									</div>
									{user.email ? (
										<div className={styles.emailRow}>
											<span className={`${styles.emailText} ${showMaskedEmail ? styles.emailTextSelectable : ''}`}>
												{showMaskedEmail ? user.email : maskEmail(user.email)}
											</span>
											<button
												type="button"
												className={styles.toggleButton}
												onClick={() => setShowMaskedEmail(!showMaskedEmail)}
											>
												{showMaskedEmail ? t`Hide` : t`Reveal`}
											</button>
										</div>
									) : (
										<div className={styles.warningText}>
											<Trans>No email address set</Trans>
										</div>
									)}
								</div>
								<Button small={true} onClick={() => ModalActionCreators.push(modal(() => <EmailChangeModal />))}>
									{user.email ? <Trans>Change Email</Trans> : <Trans>Add Email</Trans>}
								</Button>
							</div>

							{user.email && !user.verified && <EmailVerificationAlert />}
						</>
					) : (
						<div className={styles.row}>
							<div className={styles.rowContent}>
								<div className={styles.label}>
									<Trans>Email Address</Trans>
								</div>
								<div className={styles.warningText}>
									<Trans>No email address set</Trans>
								</div>
							</div>
							<Button small={true} className={styles.claimButton} fitContent onClick={() => openClaimAccountModal()}>
								<Trans>Add Email</Trans>
							</Button>
						</div>
					)}
				</SettingsTabSection>

				<SettingsTabSection>
					<div className={styles.row}>
						{isClaimed ? (
							<>
								<div className={styles.rowContent}>
									<div className={styles.label}>
										<Trans>Current Password</Trans>
									</div>
									<div className={styles.description}>
										{user.passwordLastChangedAt ? (
											<Trans>Last changed: {DateUtils.getRelativeDateString(user.passwordLastChangedAt, i18n)}</Trans>
										) : (
											<Trans>Last changed: Never</Trans>
										)}
									</div>
								</div>
								<Button small={true} onClick={() => ModalActionCreators.push(modal(() => <PasswordChangeModal />))}>
									<Trans>Change Password</Trans>
								</Button>
							</>
						) : (
							<>
								<div className={styles.rowContent}>
									<div className={styles.label}>
										<Trans>Password</Trans>
									</div>
									<div className={styles.warningText}>
										<Trans>No password set</Trans>
									</div>
								</div>
								<Button small={true} className={styles.claimButton} fitContent onClick={() => openClaimAccountModal()}>
									<Trans>Set Password</Trans>
								</Button>
							</>
						)}
					</div>
				</SettingsTabSection>
			</>
		);
	},
);
