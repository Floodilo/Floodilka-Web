/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import type React from 'react';
import {Input} from '~/components/form/Input';
import {Button} from '~/components/uikit/Button/Button';
import styles from './ApplicationDetail.module.css';
import {SectionCard} from './SectionCard';

interface SecretsSectionProps {
	clientSecret: string | null;
	botToken: string | null;
	onRegenerateClientSecret: () => void;
	onRegenerateBotToken: () => void;
	isRotatingClient: boolean;
	isRotatingBot: boolean;
	hasBot: boolean;
	clientSecretInputId: string;
	botTokenInputId: string;
}

export const SecretsSection: React.FC<SecretsSectionProps> = ({
	clientSecret,
	botToken,
	onRegenerateClientSecret,
	onRegenerateBotToken,
	isRotatingClient,
	isRotatingBot,
	hasBot,
	clientSecretInputId,
	botTokenInputId,
}) => {
	const {t} = useLingui();
	return (
		<SectionCard
			title={t`Secrets & tokens`}
			subtitle={t`Keep these safe. Regenerating will break existing integrations.`}
		>
			<div className={styles.fieldStack}>
				<div className={styles.secretRow}>
					<Input
						id={clientSecretInputId}
						label={t`Client secret`}
						type="text"
						value={clientSecret ?? ''}
						readOnly
						placeholder={clientSecret ? '•'.repeat(64) : '•'.repeat(64)}
					/>
					<div className={styles.secretActions}>
						<Button variant="primary" compact submitting={isRotatingClient} onClick={onRegenerateClientSecret}>
							{t`Regenerate`}
						</Button>
					</div>
				</div>

				{hasBot && (
					<div className={styles.secretRow}>
						<Input
							id={botTokenInputId}
							label={t`Bot token`}
							type="text"
							value={botToken ?? ''}
							readOnly
							placeholder={botToken ? '•'.repeat(64) : '•'.repeat(64)}
						/>
						<div className={styles.secretActions}>
							<Button variant="primary" compact submitting={isRotatingBot} onClick={onRegenerateBotToken}>
								{t`Regenerate`}
							</Button>
						</div>
					</div>
				)}
			</div>
		</SectionCard>
	);
};
