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
import styles from './GiftSection.module.css';
import {PurchaseDisabledWrapper} from './PurchaseDisabledWrapper';
import {SectionHeader} from './SectionHeader';

interface GiftSectionProps {
	giftSectionRef: React.RefObject<HTMLDivElement | null>;
	monthlyPrice: string;
	yearlyPrice: string;
	loadingCheckout: boolean;
	loadingSlots: boolean;
	handleSelectPlan: (plan: 'gift1Month' | 'gift1Year') => void;
	purchaseDisabled?: boolean;
	purchaseDisabledTooltip?: React.ReactNode;
}

export const GiftSection: React.FC<GiftSectionProps> = observer(
	({
		giftSectionRef,
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
			<div ref={giftSectionRef}>
				<section className={styles.section}>
					<SectionHeader
						title={<Trans>Gift Premium</Trans>}
						description={
							<Trans>Share the Premium experience with your friends by purchasing a gift subscription.</Trans>
						}
					/>
					<div className={gridStyles.gridWrapper}>
						<div className={gridStyles.gridThreeColumns}>
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
			</div>
		);
	},
);
