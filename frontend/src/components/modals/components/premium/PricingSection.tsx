/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {ArrowDownIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {PricingCard} from '../PricingCard';
import gridStyles from '../PricingGrid.module.css';
import {PurchaseDisclaimer} from '../PurchaseDisclaimer';
import {ToggleButton} from '../ToggleButton';
import styles from './PricingSection.module.css';
import {PurchaseDisabledWrapper} from './PurchaseDisabledWrapper';

interface PricingSectionProps {
	isGiftMode: boolean;
	setIsGiftMode: (value: boolean) => void;
	monthlyPrice: string;
	yearlyPrice: string;
	loadingCheckout: boolean;
	loadingSlots: boolean;
	handleSelectPlan: (plan: 'monthly' | 'yearly' | 'gift1Month' | 'gift1Year') => void;
	purchaseDisabled?: boolean;
	purchaseDisabledTooltip?: React.ReactNode;
}

export const PricingSection: React.FC<PricingSectionProps> = observer(
	({
		isGiftMode,
		setIsGiftMode,
		monthlyPrice,
		yearlyPrice,
		loadingCheckout,
		loadingSlots,
		handleSelectPlan,
		purchaseDisabled = false,
		purchaseDisabledTooltip,
	}) => {
		const {t} = useLingui();
		const tooltipText: React.ReactNode = purchaseDisabledTooltip ?? t`Claim your account to purchase Floodilka Premium.`;

		return (
			<section className={styles.section}>
				<div className={styles.toggleContainer} role="tablist" aria-label={t`Purchase mode`}>
					<ToggleButton active={!isGiftMode} onClick={() => setIsGiftMode(false)} label={t`For Me`} />
					<ToggleButton active={isGiftMode} onClick={() => setIsGiftMode(true)} label={t`As a Gift`} />
				</div>

				<div className={gridStyles.gridWrapper}>
					<div className={gridStyles.gridThreeColumns}>
						{!isGiftMode ? (
							<>
								<PurchaseDisabledWrapper disabled={purchaseDisabled} tooltipText={tooltipText}>
									<PricingCard
										title={t`Monthly`}
										price={monthlyPrice}
										period={t`per month`}
										onSelect={() => handleSelectPlan('monthly')}
										isLoading={loadingCheckout || loadingSlots}
										disabled={purchaseDisabled}
									/>
								</PurchaseDisabledWrapper>
								<PurchaseDisabledWrapper disabled={purchaseDisabled} tooltipText={tooltipText}>
									<PricingCard
										title={t`Yearly`}
										price={yearlyPrice}
										period={t`per year`}
										badge={t`Save 17%`}
										isPopular
										onSelect={() => handleSelectPlan('yearly')}
										buttonText={t`Upgrade Now`}
										isLoading={loadingCheckout || loadingSlots}
										disabled={purchaseDisabled}
									/>
								</PurchaseDisabledWrapper>
							</>
						) : (
							<>
								<PurchaseDisabledWrapper disabled={purchaseDisabled} tooltipText={tooltipText}>
									<PricingCard
										title={t`1 Year Gift`}
										price={yearlyPrice}
										period={t`one-time purchase`}
										badge={t`Save 17%`}
										onSelect={() => handleSelectPlan('gift1Year')}
										buttonText={t`Buy Gift`}
										isLoading={loadingCheckout || loadingSlots}
										disabled={purchaseDisabled}
									/>
								</PurchaseDisabledWrapper>
								<PurchaseDisabledWrapper disabled={purchaseDisabled} tooltipText={tooltipText}>
									<PricingCard
										title={t`1 Month Gift`}
										price={monthlyPrice}
										period={t`one-time purchase`}
										isPopular
										onSelect={() => handleSelectPlan('gift1Month')}
										buttonText={t`Buy Gift`}
										isLoading={loadingCheckout || loadingSlots}
										disabled={purchaseDisabled}
									/>
								</PurchaseDisabledWrapper>
							</>
						)}
					</div>
				</div>

				<div className={styles.footerContainer}>
					<PurchaseDisclaimer />
					<div className={styles.scrollPromptContainer}>
						<p className={styles.scrollPromptText}>
							<Trans>Scroll down to view all the sweet perks you get with Premium</Trans>
						</p>
						<ArrowDownIcon className={styles.scrollPromptIcon} weight="bold" />
					</div>
				</div>
			</section>
		);
	},
);
