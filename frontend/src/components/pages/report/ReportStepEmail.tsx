/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import type React from 'react';
import {Input} from '~/components/form/Input';
import {Button} from '~/components/uikit/Button/Button';
import styles from '../ReportPage.module.css';

type Props = {
	email: string;
	errorMessage: string | null;
	isSending: boolean;
	onEmailChange: (value: string) => void;
	onSubmit: () => void;
	onStartOver: () => void;
};

export const ReportStepEmail: React.FC<Props> = ({
	email,
	errorMessage,
	isSending,
	onEmailChange,
	onSubmit,
	onStartOver,
}) => {
	const {t} = useLingui();
	const normalizedEmail = email.trim();
	const emailLooksValid = normalizedEmail.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);

	return (
		<div className={styles.card}>
			<header className={styles.cardHeader}>
				<p className={styles.eyebrow}>
					<Trans>Step 2</Trans>
				</p>
				<h1 className={styles.title}>
					<Trans>Verify your email</Trans>
				</h1>
				<p className={styles.description}>
					<Trans>We'll send a short code to confirm you can receive updates about this report.</Trans>
				</p>
			</header>

			<div className={styles.cardBody}>
				{errorMessage && (
					<div className={styles.errorBox} role="alert" aria-live="polite">
						{errorMessage}
					</div>
				)}

				<form
					className={styles.form}
					onSubmit={(e) => {
						e.preventDefault();
						onSubmit();
					}}
				>
					<Input
						label={t`Email Address`}
						type="email"
						value={email}
						onChange={(e) => onEmailChange(e.target.value)}
						placeholder="you@example.com"
						autoComplete="email"
					/>

					<div className={styles.actionRow}>
						<Button
							fitContent
							type="submit"
							disabled={!emailLooksValid || isSending}
							submitting={isSending}
							className={styles.actionButton}
						>
							<Trans>Send Verification Code</Trans>
						</Button>

						<Button
							variant="secondary"
							fitContent
							type="button"
							onClick={onStartOver}
							disabled={isSending}
							className={styles.actionButton}
						>
							<Trans>Start over</Trans>
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ReportStepEmail;
