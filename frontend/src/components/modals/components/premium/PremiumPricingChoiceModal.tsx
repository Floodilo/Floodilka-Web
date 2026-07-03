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

import {useLingui} from '@lingui/react/macro';
import React from 'react';
import * as Modal from '~/components/modals/Modal';
import {PricingCard} from '~/components/modals/components/PricingCard';
import {PurchaseDisclaimer} from '~/components/modals/components/PurchaseDisclaimer';
import {PurchaseDisabledWrapper} from './PurchaseDisabledWrapper';
import styles from './PremiumPricingChoiceModal.module.css';

type Plan = 'monthly' | 'yearly' | 'gift1Month' | 'gift1Year';

export type PremiumPricingChoiceKind = 'subscribe' | 'gift';

interface PremiumPricingChoiceModalProps {
	kind: PremiumPricingChoiceKind;
	monthlyPrice: string;
	yearlyPrice: string;
	/** «≈ 166 ₽ в месяц · экономия 17%» — считается из реальных цен в PremiumContent. */
	yearlySavingsNote?: string;
	loadingCheckout: boolean;
	loadingSlots: boolean;
	purchaseDisabled?: boolean;
	purchaseDisabledTooltip?: React.ReactNode;
	onClose: () => void;
	onSelectPlan: (plan: Plan) => void;
}

export const PremiumPricingChoiceModal: React.FC<PremiumPricingChoiceModalProps> = ({
	kind,
	monthlyPrice,
	yearlyPrice,
	yearlySavingsNote,
	loadingCheckout,
	loadingSlots,
	purchaseDisabled = false,
	purchaseDisabledTooltip,
	onClose,
	onSelectPlan,
}) => {
	const {t} = useLingui();
	const tooltipText: React.ReactNode =
		purchaseDisabledTooltip ?? t`Подтвердите аккаунт, чтобы купить Флудилка Премиум.`;
	const isBusy = loadingCheckout || loadingSlots;

	const handlePick = React.useCallback(
		(plan: Plan) => {
			onClose();
			queueMicrotask(() => onSelectPlan(plan));
		},
		[onClose, onSelectPlan],
	);

	const title = kind === 'subscribe' ? t`Выберите период` : t`Выберите подарок`;

	return (
		<Modal.Root size="large" onClose={onClose}>
			<Modal.Header title={title} />
			<Modal.Content className={styles.content}>
				<div className={styles.inner}>
				<div className={styles.cardsRow}>
					{kind === 'subscribe' ? (
						<>
							<PurchaseDisabledWrapper disabled={purchaseDisabled} tooltipText={tooltipText}>
								<PricingCard
									title={t`Ежегодно`}
									price={yearlyPrice}
									period={t`/ год`}
									badge={yearlySavingsNote ?? t`экономия 17%`}
									isPopular
									onSelect={() => handlePick('yearly')}
									isLoading={isBusy}
									disabled={purchaseDisabled}
									className={styles.card}
								/>
							</PurchaseDisabledWrapper>
							<PurchaseDisabledWrapper disabled={purchaseDisabled} tooltipText={tooltipText}>
								<PricingCard
									title={t`Ежемесячно`}
									price={monthlyPrice}
									period={t`/ месяц`}
									onSelect={() => handlePick('monthly')}
									isLoading={isBusy}
									disabled={purchaseDisabled}
									className={styles.card}
								/>
							</PurchaseDisabledWrapper>
						</>
					) : (
						<>
							<PurchaseDisabledWrapper disabled={purchaseDisabled} tooltipText={tooltipText}>
								<PricingCard
									title={t`Подарок на 1 год`}
									price={yearlyPrice}
									period={t`разовая покупка`}
									badge={t`Экономия 17%`}
									isPopular
									onSelect={() => handlePick('gift1Year')}
									isLoading={isBusy}
									disabled={purchaseDisabled}
									className={styles.card}
								/>
							</PurchaseDisabledWrapper>
							<PurchaseDisabledWrapper disabled={purchaseDisabled} tooltipText={tooltipText}>
								<PricingCard
									title={t`Подарок на 1 месяц`}
									price={monthlyPrice}
									period={t`разовая покупка`}
									onSelect={() => handlePick('gift1Month')}
									isLoading={isBusy}
									disabled={purchaseDisabled}
									className={styles.card}
								/>
							</PurchaseDisabledWrapper>
						</>
					)}
				</div>
				<div className={styles.disclaimer}>
					<PurchaseDisclaimer />
				</div>
				</div>
			</Modal.Content>
		</Modal.Root>
	);
};
