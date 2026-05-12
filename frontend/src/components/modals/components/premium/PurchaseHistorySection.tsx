/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {Button} from '~/components/uikit/Button/Button';
import styles from './PurchaseHistorySection.module.css';

interface PurchaseHistorySectionProps {
	loadingPortal: boolean;
	handleOpenCustomerPortal: () => void;
}

export const PurchaseHistorySection: React.FC<PurchaseHistorySectionProps> = observer(
	({loadingPortal, handleOpenCustomerPortal}) => {
		return (
			<section className={styles.section}>
				<div className={styles.card}>
					<div className={styles.grid}>
						<div className={styles.content}>
							<h3 className={styles.title}>
								<Trans>Purchase History</Trans>
							</h3>
							<p className={styles.description}>
								<Trans>View all your past purchases and invoices securely in the customer portal.</Trans>
							</p>
						</div>
						<Button
							variant="primary"
							onClick={handleOpenCustomerPortal}
							submitting={loadingPortal}
							className={styles.button}
						>
							<Trans>View Purchase History</Trans>
						</Button>
					</div>
				</div>
			</section>
		);
	},
);
