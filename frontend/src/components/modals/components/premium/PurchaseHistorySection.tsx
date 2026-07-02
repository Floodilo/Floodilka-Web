/*
 * Copyright (C) 2026 Floodilka Contributors
 *
 * This file is part of Floodilka.
 *
 * Floodilka is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Floodilka is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Floodilka. If not, see <https://www.gnu.org/licenses/>.
 */

import {Trans} from '@lingui/react/macro';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {Button} from '~/components/uikit/Button/Button';
import styles from './PurchaseHistorySection.module.css';

interface PurchaseHistorySectionProps {
	loadingPortal: boolean;
	handleOpenCustomerPortal: () => void;
	embeddedInPanel?: boolean;
}

export const PurchaseHistorySection: React.FC<PurchaseHistorySectionProps> = observer(
	({loadingPortal, handleOpenCustomerPortal, embeddedInPanel = false}) => {
		return (
			<section className={clsx(styles.section, embeddedInPanel && styles.sectionEmbedded)}>
				<div className={clsx(styles.card, embeddedInPanel && styles.cardEmbedded)}>
					<div className={clsx(styles.grid, embeddedInPanel && styles.gridBilling)}>
						<div className={styles.content}>
							<h3 className={styles.title}>
								<Trans>История покупок</Trans>
							</h3>
							<p className={styles.description}>
								<Trans>Все прошлые покупки и счета — в личном кабинете платёжной системы.</Trans>
							</p>
						</div>
						<Button
							variant={embeddedInPanel ? 'secondary' : 'primary'}
							onClick={handleOpenCustomerPortal}
							submitting={loadingPortal}
							small={embeddedInPanel}
							fitContent={embeddedInPanel}
							className={clsx(styles.button, embeddedInPanel && styles.buttonBilling)}
						>
							{embeddedInPanel ? <Trans>Смотреть историю</Trans> : <Trans>Открыть историю покупок</Trans>}
						</Button>
					</div>
				</div>
			</section>
		);
	},
);
