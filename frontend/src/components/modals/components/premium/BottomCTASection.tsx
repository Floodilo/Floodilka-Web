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

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {Button} from '~/components/uikit/Button/Button';
import {PremiumPricingChoiceModal} from './PremiumPricingChoiceModal';
import styles from './BottomCTASection.module.css';
import {PurchaseDisabledWrapper} from './PurchaseDisabledWrapper';

interface BottomCTASectionProps {
	monthlyPrice: string;
	yearlyPrice: string;
	loadingCheckout: boolean;
	loadingSlots: boolean;
	handleSelectPlan: (plan: 'monthly' | 'yearly' | 'gift1Month' | 'gift1Year') => void;
	purchaseDisabled?: boolean;
	purchaseDisabledTooltip?: React.ReactNode;
	/** Уже есть подписка — только белая кнопка «Подарить», без «Подписаться». */
	hideSubscribe?: boolean;
}

export const BottomCTASection: React.FC<BottomCTASectionProps> = observer(
	({
		monthlyPrice,
		yearlyPrice,
		loadingCheckout,
		loadingSlots,
		handleSelectPlan,
		purchaseDisabled = false,
		purchaseDisabledTooltip,
		hideSubscribe = false,
	}) => {
		const {t} = useLingui();
		const tooltipText: React.ReactNode = purchaseDisabledTooltip ?? t`Подтвердите аккаунт, чтобы купить Флудилка Премиум.`;
		const isBusy = loadingCheckout || loadingSlots;

		const openChoiceModal = React.useCallback(
			(kind: 'subscribe' | 'gift') => {
				// Важно: ModalActionCreators импортируем динамически, чтобы не тащить его в граф загрузки PremiumContent.
				void import('~/actions/ModalActionCreators').then((ModalAC) => {
					ModalAC.push(
						ModalAC.modal(() => (
							<PremiumPricingChoiceModal
								kind={kind}
								monthlyPrice={monthlyPrice}
								yearlyPrice={yearlyPrice}
								loadingCheckout={loadingCheckout}
								loadingSlots={loadingSlots}
								purchaseDisabled={purchaseDisabled}
								purchaseDisabledTooltip={purchaseDisabledTooltip}
								onClose={() => ModalAC.pop()}
								onSelectPlan={handleSelectPlan}
							/>
						)),
					);
				});
			},
			[
				monthlyPrice,
				yearlyPrice,
				loadingCheckout,
				loadingSlots,
				purchaseDisabled,
				purchaseDisabledTooltip,
				handleSelectPlan,
			],
		);

		return (
			<section className={styles.container} aria-labelledby="premium-bottom-cta-heading">
				<div className={styles.headerBlock}>
					<h2 id="premium-bottom-cta-heading" className={styles.title}>
						<Trans>Попробуй премиум прямо сейчас</Trans>
					</h2>
					<p className={styles.subtitle}>
						<Trans>Отменить подписку можно в любой момент</Trans>
					</p>
				</div>

				<div
					className={
						hideSubscribe ? `${styles.actionsRow} ${styles.actionsRowGiftOnly}` : styles.actionsRow
					}
				>
					{!hideSubscribe && (
						<PurchaseDisabledWrapper disabled={purchaseDisabled} tooltipText={tooltipText}>
							<Button
								variant="primary"
								type="button"
								fitContainer
								className={`${styles.actionButton} ${(styles as any).primaryCta}`}
								onClick={() => openChoiceModal('subscribe')}
								submitting={isBusy}
								disabled={purchaseDisabled}
							>
								<Trans>Подписаться</Trans>
							</Button>
						</PurchaseDisabledWrapper>
					)}
					<PurchaseDisabledWrapper disabled={purchaseDisabled} tooltipText={tooltipText}>
						<Button
							variant="primary"
							type="button"
							fitContainer
							className={`${styles.actionButton} ${
								hideSubscribe ? (styles as any).primaryCta : (styles as any).secondaryCta
							}`}
							onClick={() => openChoiceModal('gift')}
							submitting={isBusy}
							disabled={purchaseDisabled}
						>
							<Trans>Подарить подписку</Trans>
						</Button>
					</PurchaseDisabledWrapper>
				</div>
			</section>
		);
	},
);
