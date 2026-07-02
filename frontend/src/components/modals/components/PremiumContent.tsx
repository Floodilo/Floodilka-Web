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
import {observer} from 'mobx-react-lite';
import React from 'react';
import {GuildFeatures} from '~/Constants';
import {ComponentDispatch} from '~/lib/ComponentDispatch';
import GeoIPStore from '~/stores/GeoIPStore';
import GuildStore from '~/stores/GuildStore';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import UserStore from '~/stores/UserStore';
import * as LocaleUtils from '~/utils/LocaleUtils';
import {formatPrice} from '~/utils/PricingUtils';
import {Button} from '~/components/uikit/Button/Button';
import {FeatureComparisonTable} from './FeatureComparisonTable';
import styles from './PremiumContent.module.css';
import {BottomCTASection} from './premium/BottomCTASection';
import {PremiumBentoFeatures} from './premium/PremiumBentoFeatures';
import {GiftInventoryBanner} from './premium/GiftInventoryBanner';
import {PremiumPricingChoiceModal} from './premium/PremiumPricingChoiceModal';
import {PurchaseDisabledWrapper} from './premium/PurchaseDisabledWrapper';
import {useCheckoutActions} from './premium/hooks/useCheckoutActions';
import {useCommunityActions} from './premium/hooks/useCommunityActions';
import {usePremiumData} from './premium/hooks/usePremiumData';
import {useSubscriptionActions} from './premium/hooks/useSubscriptionActions';
import {useSubscriptionStatus} from './premium/hooks/useSubscriptionStatus';
import {PremiumUpsellBanner} from './premium/PremiumUpsellBanner';
import {PurchaseHistorySection} from './premium/PurchaseHistorySection';
import {SubscriptionCard} from './premium/SubscriptionCard';

type PremiumContentView = 'auto' | 'promo' | 'billing';

export const PremiumContent: React.FC<{defaultGiftMode?: boolean; fullWidth?: boolean; view?: PremiumContentView}> = observer(
	({defaultGiftMode = false, fullWidth = false, view = 'auto'}) => {
	const currentUser = UserStore.currentUser;
	const locale = LocaleUtils.getCurrentLocale();
	const formatter = new Intl.NumberFormat(locale);
	const mobileLayoutState = MobileLayoutStore;

	const perksSectionRef = React.useRef<HTMLDivElement | null>(null);

	const countryCode = GeoIPStore.countryCode;
	const guilds = GuildStore.getGuilds();

	const operatorGuild = React.useMemo(() => {
		return guilds.find((guild) => guild.features.has(GuildFeatures.OPERATOR));
	}, [guilds]);

	const subscriptionStatus = useSubscriptionStatus(currentUser);
	const {priceIds, loadingPrices} = usePremiumData(countryCode);
	const {
		loadingPortal,
		loadingCancel,
		loadingReactivate,
		handleOpenCustomerPortal,
		handleCancelSubscription,
		handleReactivateSubscription,
	} = useSubscriptionActions();
	const {
		loadingRejoinCommunity,
		isCommunityMenuOpen,
		communityButtonRef,
		handleCommunityButtonPointerDown,
		handleCommunityButtonClick,
	} = useCommunityActions(operatorGuild);
	const {loadingCheckout, handleSelectPlan} = useCheckoutActions(
		priceIds,
		subscriptionStatus.isGiftSubscription,
		mobileLayoutState.enabled,
	);

	const isClaimed = currentUser?.isClaimed() ?? false;
	const purchaseDisabled = !isClaimed;
	const purchaseDisabledTooltip = <Trans>Подтвердите аккаунт, чтобы купить Флудилка Премиум.</Trans>;
	const handleSelectPlanGuarded = React.useCallback(
		(plan: 'monthly' | 'yearly' | 'gift1Month' | 'gift1Year') => {
			if (purchaseDisabled) return;
			handleSelectPlan(plan);
		},
		[handleSelectPlan, purchaseDisabled],
	);

	const monthlyPrice = React.useMemo(() => (priceIds ? formatPrice(priceIds.monthly) : '...'), [priceIds]);
	const yearlyPrice = React.useMemo(() => (priceIds ? formatPrice(priceIds.yearly) : '...'), [priceIds]);

	const scrollToPerks = React.useCallback(() => {
		perksSectionRef.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
	}, []);

	const handlePerksKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLSpanElement>) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				scrollToPerks();
			}
		},
		[scrollToPerks],
	);

	const navigateToRedeemGift = React.useCallback(() => {
		ComponentDispatch.dispatch('USER_SETTINGS_TAB_SELECT', {tab: 'gift_inventory'});
	}, []);

	const openGiftPremiumModal = React.useCallback(() => {
		void import('~/actions/ModalActionCreators').then((ModalAC) => {
			ModalAC.push(
				ModalAC.modal(() => (
					<PremiumPricingChoiceModal
						kind="gift"
						monthlyPrice={monthlyPrice}
						yearlyPrice={yearlyPrice}
						loadingCheckout={loadingCheckout}
						loadingSlots={loadingPrices}
						purchaseDisabled={purchaseDisabled}
						purchaseDisabledTooltip={purchaseDisabledTooltip}
						onClose={() => ModalAC.pop()}
						onSelectPlan={handleSelectPlanGuarded}
					/>
				)),
			);
		});
	}, [
		monthlyPrice,
		yearlyPrice,
		loadingCheckout,
		loadingPrices,
		purchaseDisabled,
		purchaseDisabledTooltip,
		handleSelectPlanGuarded,
	]);

	const openSubscribePremiumModal = React.useCallback(() => {
		void import('~/actions/ModalActionCreators').then((ModalAC) => {
			ModalAC.push(
				ModalAC.modal(() => (
					<PremiumPricingChoiceModal
						kind="subscribe"
						monthlyPrice={monthlyPrice}
						yearlyPrice={yearlyPrice}
						loadingCheckout={loadingCheckout}
						loadingSlots={loadingPrices}
						purchaseDisabled={purchaseDisabled}
						purchaseDisabledTooltip={purchaseDisabledTooltip}
						onClose={() => ModalAC.pop()}
						onSelectPlan={handleSelectPlanGuarded}
					/>
				)),
			);
		});
	}, [
		monthlyPrice,
		yearlyPrice,
		loadingCheckout,
		loadingPrices,
		purchaseDisabled,
		purchaseDisabledTooltip,
		handleSelectPlanGuarded,
	]);

	if (!currentUser) return null;

	const premiumMarketingHeader = (
		<div className={styles.header}>
			<h1 className={styles.title}>
				<Trans>
					Флудилка премиум всего за <span className={styles.priceAccent}>199 ₽ в месяц</span>
				</Trans>
			</h1>
			<p className={styles.description}>
				<Trans>
					Расширенные лимиты и эксклюзивные функции — и ваша поддержка независимой платформы для общения.
				</Trans>
			</p>
			<div
				className={
					subscriptionStatus.isPremium
						? `${styles.marketingActionsRow} ${styles.marketingActionsRowGiftOnly}`
						: styles.marketingActionsRow
				}
			>
				{!subscriptionStatus.isPremium && (
					<PurchaseDisabledWrapper disabled={purchaseDisabled} tooltipText={purchaseDisabledTooltip}>
						<Button
							variant="primary"
							type="button"
							fitContainer
							className={`${styles.marketingActionButton} ${styles.marketingSubscribeButton}`}
							onClick={openSubscribePremiumModal}
							submitting={loadingCheckout || loadingPrices}
							disabled={purchaseDisabled}
						>
							<Trans>Подписаться</Trans>
						</Button>
					</PurchaseDisabledWrapper>
				)}
				<PurchaseDisabledWrapper disabled={purchaseDisabled} tooltipText={purchaseDisabledTooltip}>
					<Button
						variant="primary"
						type="button"
						fitContainer
						className={`${styles.marketingActionButton} ${
							subscriptionStatus.isPremium ? styles.marketingGiftButtonPromoSolo : styles.marketingGiftButton
						}`}
						onClick={openGiftPremiumModal}
						submitting={loadingCheckout || loadingPrices}
						disabled={purchaseDisabled}
					>
						<Trans>Подарить подписку</Trans>
					</Button>
				</PurchaseDisabledWrapper>
			</div>
		</div>
	);

	const comparisonBundle = (
		<>
			<h2 id="premium-comparison-heading" className={styles.comparisonSectionTitle}>
				<Trans>Сравни бесплатный и премиум тарифы</Trans>
			</h2>
			<FeatureComparisonTable formatter={formatter} />
		</>
	);

	const billingManagementContent = (
		<div
			className={`${styles.mainContainer} ${styles.subscriberPremiumOnly} ${fullWidth ? (styles as any).fullWidth : ''}`}
		>
			<section
				className={`${styles.subscriptionManagementSection} ${fullWidth ? styles.subscriptionManagementSectionFullWidth : ''}`}
				aria-labelledby="premium-subscription-management-heading"
			>
				<h2 id="premium-subscription-management-heading" className={styles.subscriptionManagementHeading}>
					<Trans>Управление подпиской</Trans>
				</h2>
				{subscriptionStatus.shouldShowPremiumCard ? (
					<SubscriptionCard
						embeddedInPanel
						onGiftRibbonClick={openGiftPremiumModal}
						currentUser={currentUser}
						locale={locale}
						isGiftSubscription={subscriptionStatus.isGiftSubscription}
						billingCycle={subscriptionStatus.billingCycle}
						monthlyPrice={monthlyPrice}
						yearlyPrice={yearlyPrice}
						gracePeriodInfo={subscriptionStatus.gracePeriodInfo}
						premiumWillCancel={subscriptionStatus.premiumWillCancel}
						subscriptionCardColorClass={subscriptionStatus.subscriptionCardColorClass}
						subscriptionStatusColor={subscriptionStatus.subscriptionStatusColor}
						hasEverPurchased={subscriptionStatus.hasEverPurchased}
						shouldUseCancelQuickAction={subscriptionStatus.shouldUseCancelQuickAction}
						shouldUseReactivateQuickAction={subscriptionStatus.shouldUseReactivateQuickAction}
						loadingPortal={loadingPortal}
						loadingCancel={loadingCancel}
						loadingReactivate={loadingReactivate}
						loadingRejoinCommunity={loadingRejoinCommunity}
						loadingCheckout={loadingCheckout}
						isCommunityMenuOpen={isCommunityMenuOpen}
						communityButtonRef={communityButtonRef}
						scrollToPerks={scrollToPerks}
						handlePerksKeyDown={handlePerksKeyDown}
						navigateToRedeemGift={navigateToRedeemGift}
						handleOpenCustomerPortal={handleOpenCustomerPortal}
						handleReactivateSubscription={handleReactivateSubscription}
						handleCancelSubscription={handleCancelSubscription}
						handleCommunityButtonPointerDown={handleCommunityButtonPointerDown}
						handleCommunityButtonClick={handleCommunityButtonClick}
						purchaseDisabled={purchaseDisabled}
						purchaseDisabledTooltip={purchaseDisabledTooltip}
					/>
				) : (
					<div className={styles.billingEmptyCard}>
						<div className={styles.billingEmptyCopy}>
							<h3 className={styles.billingEmptyTitle}>
								<Trans>Премиум не оформлен</Trans>
							</h3>
						</div>
						<div className={styles.billingEmptyActions}>
							<PurchaseDisabledWrapper disabled={purchaseDisabled} tooltipText={purchaseDisabledTooltip}>
								<Button
									variant="primary"
									type="button"
									small
									fitContent
									className={`${styles.marketingActionButton} ${styles.marketingSubscribeButton}`}
									onClick={openSubscribePremiumModal}
									submitting={loadingCheckout || loadingPrices}
									disabled={purchaseDisabled}
								>
									<Trans>Оформить подписку</Trans>
								</Button>
							</PurchaseDisabledWrapper>
							<Button variant="secondary" type="button" small fitContent onClick={navigateToRedeemGift}>
								<Trans>Активировать код</Trans>
							</Button>
						</div>
					</div>
				)}
				{subscriptionStatus.hasEverPurchased && !subscriptionStatus.shouldShowPremiumCard && (
					<PurchaseHistorySection
						embeddedInPanel
						loadingPortal={loadingPortal}
						handleOpenCustomerPortal={handleOpenCustomerPortal}
					/>
				)}
			</section>
		</div>
	);

	if (defaultGiftMode) {
		return (
			<div className={`${styles.giftModeContainer} ${fullWidth ? (styles as any).fullWidth : ''}`}>
				<PremiumUpsellBanner />

				<div className={styles.heroWithPricing}>{premiumMarketingHeader}</div>

				<div ref={perksSectionRef}>
					<section className={styles.perksSection}>
						<PremiumBentoFeatures fullWidth={fullWidth} />
						<div
							className={fullWidth ? styles.comparisonTableContainerFullWidth : styles.comparisonTableContainer}
						>
							{comparisonBundle}
						</div>
					</section>
				</div>
			</div>
		);
	}

	if (view === 'billing') {
		return billingManagementContent;
	}

	if (view === 'auto' && subscriptionStatus.shouldShowPremiumCard) {
		return (
			<div
				className={`${styles.mainContainer} ${styles.subscriberPremiumOnly} ${fullWidth ? (styles as any).fullWidth : ''}`}
			>
				<section
					className={`${styles.subscriptionManagementSection} ${fullWidth ? styles.subscriptionManagementSectionFullWidth : ''}`}
					aria-labelledby="premium-subscription-management-heading"
				>
					<h2 id="premium-subscription-management-heading" className={styles.subscriptionManagementHeading}>
						<Trans>Управление подпиской</Trans>
					</h2>
					<SubscriptionCard
						embeddedInPanel
						onGiftRibbonClick={openGiftPremiumModal}
						currentUser={currentUser}
						locale={locale}
						isGiftSubscription={subscriptionStatus.isGiftSubscription}
						billingCycle={subscriptionStatus.billingCycle}
						monthlyPrice={monthlyPrice}
						yearlyPrice={yearlyPrice}
						gracePeriodInfo={subscriptionStatus.gracePeriodInfo}
						premiumWillCancel={subscriptionStatus.premiumWillCancel}
						subscriptionCardColorClass={subscriptionStatus.subscriptionCardColorClass}
						subscriptionStatusColor={subscriptionStatus.subscriptionStatusColor}
						hasEverPurchased={subscriptionStatus.hasEverPurchased}
						shouldUseCancelQuickAction={subscriptionStatus.shouldUseCancelQuickAction}
						shouldUseReactivateQuickAction={subscriptionStatus.shouldUseReactivateQuickAction}
						loadingPortal={loadingPortal}
						loadingCancel={loadingCancel}
						loadingReactivate={loadingReactivate}
						loadingRejoinCommunity={loadingRejoinCommunity}
						loadingCheckout={loadingCheckout}
						isCommunityMenuOpen={isCommunityMenuOpen}
						communityButtonRef={communityButtonRef}
						scrollToPerks={scrollToPerks}
						handlePerksKeyDown={handlePerksKeyDown}
						navigateToRedeemGift={navigateToRedeemGift}
						handleOpenCustomerPortal={handleOpenCustomerPortal}
						handleReactivateSubscription={handleReactivateSubscription}
						handleCancelSubscription={handleCancelSubscription}
						handleCommunityButtonPointerDown={handleCommunityButtonPointerDown}
						handleCommunityButtonClick={handleCommunityButtonClick}
						purchaseDisabled={purchaseDisabled}
						purchaseDisabledTooltip={purchaseDisabledTooltip}
					/>
				</section>
			</div>
		);
	}

	return (
		<div className={`${styles.mainContainer} ${fullWidth ? (styles as any).fullWidth : ''}`}>
			<>
				<GiftInventoryBanner currentUser={currentUser} />
				<div className={styles.heroWithPricing}>
					{premiumMarketingHeader}
				</div>
			</>

			<div ref={perksSectionRef}>
				<section className={styles.perksSection}>
					<PremiumBentoFeatures fullWidth={fullWidth} />
					<div className={fullWidth ? styles.comparisonTableContainerFullWidth : styles.comparisonTableContainer}>
						{comparisonBundle}
					</div>
				</section>
			</div>

			{(view === 'promo' || !subscriptionStatus.isPremium) && (
				<BottomCTASection
					monthlyPrice={monthlyPrice}
					yearlyPrice={yearlyPrice}
					loadingCheckout={loadingCheckout}
					loadingSlots={loadingPrices}
					handleSelectPlan={handleSelectPlanGuarded}
					purchaseDisabled={purchaseDisabled}
					purchaseDisabledTooltip={purchaseDisabledTooltip}
					hideSubscribe={subscriptionStatus.isPremium}
				/>
			)}
		</div>
	);
	},
);
