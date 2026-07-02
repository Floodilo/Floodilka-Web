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

import {GiftIcon} from '@phosphor-icons/react';
import {Trans, useLingui} from '@lingui/react/macro';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {Button} from '~/components/uikit/Button/Button';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import type {UserRecord} from '~/records/UserRecord';
import {getFormattedFullDate} from '~/utils/DateUtils';
import {PerksButton} from '../PerksButton';
import type {GracePeriodInfo} from './hooks/useSubscriptionStatus';
import styles from './SubscriptionCard.module.css';

interface SubscriptionCardProps {
	currentUser: UserRecord;
	locale: string;
	isGiftSubscription: boolean;
	billingCycle: string | null;
	monthlyPrice: string;
	yearlyPrice: string;
	gracePeriodInfo: GracePeriodInfo;
	premiumWillCancel: boolean;
	subscriptionCardColorClass: string;
	subscriptionStatusColor: string;
	hasEverPurchased: boolean;
	shouldUseCancelQuickAction: boolean;
	shouldUseReactivateQuickAction: boolean;
	loadingPortal: boolean;
	loadingCancel: boolean;
	loadingReactivate: boolean;
	loadingRejoinCommunity: boolean;
	loadingCheckout: boolean;
	isCommunityMenuOpen: boolean;
	communityButtonRef: React.RefObject<HTMLButtonElement | null>;
	scrollToPerks: () => void;
	handlePerksKeyDown: (event: React.KeyboardEvent<HTMLSpanElement>) => void;
	navigateToRedeemGift: () => void;
	handleOpenCustomerPortal: () => void;
	handleReactivateSubscription: () => void;
	handleCancelSubscription: () => void;
	handleCommunityButtonPointerDown: (event: React.PointerEvent) => void;
	handleCommunityButtonClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	purchaseDisabled?: boolean;
	purchaseDisabledTooltip?: React.ReactNode;
	/** Без цветного фона карточки — внутри общей панели «Управление подпиской». */
	embeddedInPanel?: boolean;
	/** Верхняя промо-лента «подарить премиум» (по клику открывает модалку подарка). */
	onGiftRibbonClick?: () => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = observer(
	({
		currentUser,
		locale: _locale,
		isGiftSubscription,
		billingCycle,
		monthlyPrice,
		yearlyPrice,
		gracePeriodInfo,
		premiumWillCancel,
		subscriptionCardColorClass,
		subscriptionStatusColor,
		hasEverPurchased,
		shouldUseCancelQuickAction,
		shouldUseReactivateQuickAction,
		loadingPortal,
		loadingCancel,
		loadingReactivate,
		loadingCheckout,
		scrollToPerks,
		handlePerksKeyDown,
		navigateToRedeemGift,
		handleOpenCustomerPortal,
		handleReactivateSubscription,
		handleCancelSubscription,
		purchaseDisabled = false,
		purchaseDisabledTooltip,
		embeddedInPanel = false,
		onGiftRibbonClick,
	}) => {
		const {t} = useLingui();
		const {isInGracePeriod, isExpired: isFullyExpired, graceEndDate} = gracePeriodInfo;
		const tooltipText: string | (() => React.ReactNode) =
			purchaseDisabledTooltip != null
				? () => purchaseDisabledTooltip
				: t`Подтвердите аккаунт, чтобы купить или активировать Флудилка Премиум.`;

		const wrapIfDisabled = (element: React.ReactElement, key: string, disabled: boolean) =>
			disabled ? (
				<Tooltip key={key} text={tooltipText}>
					<div>{element}</div>
				</Tooltip>
			) : (
				element
			);

		const embeddedToneClass = embeddedInPanel
			? isFullyExpired
				? styles.cardEmbeddedToneExpired
				: isInGracePeriod || premiumWillCancel
					? styles.cardEmbeddedToneGrace
					: styles.cardEmbeddedToneActive
			: null;

		const cardClassName = embeddedInPanel
			? clsx(styles.cardEmbedded, embeddedToneClass)
			: clsx(styles.card, subscriptionCardColorClass);

		const badgeEmbeddedTone =
			isFullyExpired || isInGracePeriod || premiumWillCancel || isGiftSubscription
				? null
				: styles.badgeEmbeddedToneLive;

		const statusBadgeEmbedded = (
			<span
				className={clsx(styles.badgeEmbedded, badgeEmbeddedTone)}
				style={
					badgeEmbeddedTone
						? undefined
						: {
								color: subscriptionStatusColor,
							}
				}
			>
				{isFullyExpired ? (
					<Trans>Истекла</Trans>
				) : isInGracePeriod ? (
					<Trans>Льготный период</Trans>
				) : premiumWillCancel ? (
					<Trans>Отменена</Trans>
				) : isGiftSubscription ? (
					<Trans>Подарок</Trans>
				) : (
					<Trans>активная</Trans>
				)}
			</span>
		);

		const premiumUntilFormatted =
			currentUser.premiumUntil != null ? getFormattedFullDate(currentUser.premiumUntil) : null;

		const graceEndFormatted = graceEndDate != null ? getFormattedFullDate(graceEndDate) : null;

		if (embeddedInPanel) {
			const showEmbeddedSubtitle =
				isFullyExpired ||
				isInGracePeriod ||
				isGiftSubscription ||
				premiumWillCancel ||
				(billingCycle !== 'monthly' && billingCycle !== 'yearly');

			const embeddedSubtitle = isFullyExpired ? (
				graceEndFormatted ? (
					<Trans>
						Подписка истекла <strong>{graceEndFormatted}</strong>. Оформите снова, чтобы вернуть преимущества.
					</Trans>
				) : (
					<Trans>Подписка истекла. Оформите снова.</Trans>
				)
			) : isInGracePeriod ? (
				graceEndFormatted ? (
					<Trans>
						Оформите подписку снова до <strong>{graceEndFormatted}</strong>, чтобы сохранить преимущества.
					</Trans>
				) : (
					<Trans>Оформите подписку снова, чтобы сохранить преимущества.</Trans>
				)
			) : isGiftSubscription ? (
				<span className={styles.giftSubscriptionHint}>
					{premiumUntilFormatted ? (
						<Trans>
							Подарочная подписка активна до <strong>{premiumUntilFormatted}</strong> Вы можете продлить её, активировав новый подарочный код.
						</Trans>
					) : (
						<Trans>Это бесплатный подарок: списаний не будет. Новый код добавит дни к текущему сроку.</Trans>
					)}
				</span>
			) : premiumWillCancel && premiumUntilFormatted ? (
				<Trans>
					После <strong>{premiumUntilFormatted}</strong> подписка завершится.
				</Trans>
			) : billingCycle === 'monthly' ? (
				<>
					{monthlyPrice} <Trans>в месяц</Trans>
				</>
			) : billingCycle === 'yearly' ? (
				<>
					{yearlyPrice} <Trans>в год</Trans>
				</>
			) : (
				<Trans>Активная подписка Премиум.</Trans>
			);

			const renewalFooterRight = (() => {
				if (isGiftSubscription) {
					return null;
				}
				if (isFullyExpired && graceEndFormatted) {
					return (
						<p className={styles.billingPlanRenewal}>
							<Trans>
								Подписка истекла <strong>{graceEndFormatted}</strong> Чтобы вернуть преимущества, оформите подписку снова.
							</Trans>
						</p>
					);
				}
				if (isInGracePeriod && graceEndFormatted) {
					return (
						<p className={styles.billingPlanRenewal}>
							<Trans>
								Подписка активна до <strong>{graceEndFormatted}</strong> Чтобы сохранить преимущества, возобновите подписку.
							</Trans>
						</p>
					);
				}
				if (premiumWillCancel && premiumUntilFormatted) {
					return (
						<p className={styles.billingPlanRenewal}>
							<Trans>
								Подписка отменена. Доступ сохранится до <strong>{premiumUntilFormatted}</strong>, дальнейших списаний не будет.
							</Trans>
						</p>
					);
				}
				if (
					currentUser.premiumUntil &&
					!premiumWillCancel &&
					!isInGracePeriod &&
					!isFullyExpired &&
					!isGiftSubscription &&
					premiumUntilFormatted
				) {
					return billingCycle === 'yearly' ? (
						<p className={styles.billingPlanRenewal}>
							<Trans>
								Годовая, след. списание <strong>{premiumUntilFormatted}</strong>
							</Trans>
						</p>
					) : billingCycle === 'monthly' ? (
						<p className={styles.billingPlanRenewal}>
							<Trans>
								Месячная, след. списание <strong>{premiumUntilFormatted}</strong>
							</Trans>
						</p>
					) : (
						<p className={styles.billingPlanRenewal}>
							<Trans>
								Списание <strong>{premiumUntilFormatted}</strong>
							</Trans>
						</p>
					);
				}
				return null;
			})();

			const manageLabel = isFullyExpired ? (
				<Trans>Возобновить</Trans>
			) : isInGracePeriod ? (
				<Trans>Возобновить</Trans>
			) : premiumWillCancel ? (
				<Trans>Возобновить</Trans>
			) : (
				<Trans>Управлять подпиской</Trans>
			);

			const manageButton =
				hasEverPurchased &&
				wrapIfDisabled(
					<Button
						variant="secondary"
						onClick={shouldUseReactivateQuickAction ? handleReactivateSubscription : handleOpenCustomerPortal}
						submitting={shouldUseReactivateQuickAction ? loadingReactivate : loadingPortal}
						small
						fitContent
						className={clsx(styles.actionButton, styles.billingGhostButton)}
						disabled={purchaseDisabled && shouldUseReactivateQuickAction}
					>
						{manageLabel}
					</Button>,
					'manage-reactivate',
					purchaseDisabled && shouldUseReactivateQuickAction,
				);

			const giftPromoBanner = onGiftRibbonClick ? (
				<div className={styles.giftPromoBanner}>
					<div className={styles.giftPromoBannerLead}>
						<GiftIcon aria-hidden className={styles.giftPromoIcon} weight="duotone" />
						<div className={styles.giftPromoCopy}>
							<p className={styles.giftPromoTitle}>
								<Trans>Флудилка Премиум в подарок</Trans>
							</p>
							<p className={styles.giftPromoHint}>
								<Trans>Подарите подписку близкому — от {monthlyPrice} в месяц, активация по коду.</Trans>
							</p>
						</div>
					</div>
					{wrapIfDisabled(
						<Button
							variant="secondary"
							type="button"
							small
							fitContent
							className={clsx(styles.actionButton, styles.billingGhostButton)}
							onClick={onGiftRibbonClick}
							submitting={loadingCheckout}
							disabled={purchaseDisabled}
						>
							<Trans>Подарить премиум</Trans>
						</Button>,
						'gift-promo-cta',
						purchaseDisabled,
					)}
				</div>
			) : null;

			const priceLine = showEmbeddedSubtitle ? (
				embeddedSubtitle
			) : billingCycle === 'monthly' ? (
				<>
					{monthlyPrice} <Trans>в месяц</Trans>
				</>
			) : billingCycle === 'yearly' ? (
				<>
					{yearlyPrice} <Trans>в год</Trans>
				</>
			) : (
				<Trans>Активная подписка Премиум.</Trans>
			);

			const planManageActions = isGiftSubscription ? (
				wrapIfDisabled(
					<Button
						variant="secondary"
						onClick={navigateToRedeemGift}
						small
						fitContent
						className={clsx(styles.actionButton, styles.billingGhostButton)}
						disabled={purchaseDisabled}
					>
						<Trans>Активировать подарочный код</Trans>
					</Button>,
					'redeem-gift',
					purchaseDisabled,
				)
			) : (
				manageButton
			);

			const planCard = (
				<div className={clsx(cardClassName, styles.billingPanelCard)}>
					<div className={styles.billingPanelRow}>
						<div className={styles.billingPanelMain}>
							<div className={styles.billingPlanTitleRow}>
								<h3 className={clsx(styles.title, styles.titleBilling)}>
									<Trans>Премиум</Trans>
								</h3>
								{statusBadgeEmbedded}
							</div>
							{!premiumWillCancel && !isInGracePeriod && !isFullyExpired && (
								<p className={styles.billingPlanPrice}>{priceLine}</p>
							)}
							{renewalFooterRight}
						</div>
						<div className={styles.billingPanelActions}>{planManageActions}</div>
					</div>
				</div>
			);

			const historyCard = hasEverPurchased ? (
				<div className={styles.billingPanelCard}>
					<div className={styles.billingPanelRow}>
						<div className={styles.billingPanelMain}>
							<h3 className={styles.billingPanelCardTitle}>
								<Trans>История покупок</Trans>
							</h3>
							<p className={styles.billingPanelCardHint}>
								<Trans>Все прошлые покупки и счета — в личном кабинете платёжной системы.</Trans>
							</p>
						</div>
						<div className={styles.billingPanelActions}>
							<Button
								variant="secondary"
								small
								fitContent
								className={clsx(styles.actionButton, styles.billingGhostButton)}
								onClick={handleOpenCustomerPortal}
								submitting={loadingPortal}
							>
								<Trans>Смотреть историю</Trans>
							</Button>
						</div>
					</div>
				</div>
			) : null;

			const cancelCard = shouldUseCancelQuickAction ? (
				<div className={clsx(styles.billingPanelCard, styles.billingPanelCardDanger)}>
					<div className={styles.billingPanelRow}>
						<div className={styles.billingPanelMain}>
							<h3 className={styles.billingPanelCardTitle}>
								<Trans>Отменить подписку</Trans>
							</h3>
							<p className={styles.billingPanelCardHint}>
								<Trans>Премиум сохранится до конца уже оплаченного периода.</Trans>
							</p>
						</div>
						<div className={styles.billingPanelActions}>
							<Button
								variant="secondary"
								small
								fitContent
								className={clsx(styles.actionButton, styles.billingDangerGhost)}
								onClick={handleCancelSubscription}
								submitting={loadingCancel}
							>
								<Trans>Отменить подписку</Trans>
							</Button>
						</div>
					</div>
				</div>
			) : null;

			return (
				<div className={styles.embeddedBillingStack}>
					{giftPromoBanner}
					{planCard}
					{historyCard}
					{cancelCard}
				</div>
			);
		}

		return (
			<div className={cardClassName}>
				<div className={styles.grid}>
					<div className={styles.content}>
						<div className={styles.header}>
							<h3 className={styles.title}>
								<Trans>Подписка Премиум</Trans>
							</h3>
							<div className={styles.badge} style={{color: subscriptionStatusColor}}>
								{isFullyExpired ? (
									<Trans>Истекла</Trans>
								) : isInGracePeriod ? (
									<Trans>Льготный период</Trans>
								) : premiumWillCancel ? (
									<Trans>Отменена</Trans>
								) : isGiftSubscription ? (
									<Trans>Подарок</Trans>
								) : (
									<Trans>Активна</Trans>
								)}
							</div>
						</div>

						<div className={styles.description}>
							{isFullyExpired ? (
								(() => {
									const expiredDate = graceEndFormatted;
									return (
										<Trans>
											Подписка истекла <strong>{expiredDate}</strong>. Вы потеряли все{' '}
											<PerksButton onClick={scrollToPerks} onKeyDown={handlePerksKeyDown} />. Подписку можно возобновить в
											любой момент.
										</Trans>
									);
								})()
							) : isInGracePeriod ? (
								(() => {
									const graceDate = graceEndFormatted;
									return (
										<Trans>
											Подписка закончилась, но все{' '}
											<PerksButton onClick={scrollToPerks} onKeyDown={handlePerksKeyDown} /> сохраняются до{' '}
											<strong>{graceDate}</strong>. Оформите подписку снова, чтобы их сохранить.
										</Trans>
									);
								})()
							) : isGiftSubscription ? (
								(() => {
									const giftEndDate = premiumUntilFormatted;
									return (
										<>
											<Trans>
												У вас есть все <PerksButton onClick={scrollToPerks} onKeyDown={handlePerksKeyDown} /> по{' '}
												<strong>подарочной подписке</strong> до <strong>{giftEndDate}</strong>. Она{' '}
												<strong>не продлевается автоматически</strong>.
											</Trans>
											<br />
											<Trans>
												Можно активировать ещё подарочные коды, чтобы <strong>продлить</strong> срок. Помесячную или
												годовую подписку можно оформить после окончания подарка.
											</Trans>
										</>
									);
								})()
							) : premiumWillCancel ? (
								(() => {
									const cancelDate = premiumUntilFormatted;
									return (
										<Trans>
											Подписка будет отменена <strong>{cancelDate}</strong>. После этой даты вы потеряете все{' '}
											<PerksButton onClick={scrollToPerks} onKeyDown={handlePerksKeyDown} />.
										</Trans>
									);
								})()
							) : billingCycle === 'monthly' ? (
								<Trans>
									У вас есть все <PerksButton onClick={scrollToPerks} onKeyDown={handlePerksKeyDown} /> за{' '}
									<strong>{monthlyPrice} в месяц</strong>.
								</Trans>
							) : billingCycle === 'yearly' ? (
								<Trans>
									У вас есть все <PerksButton onClick={scrollToPerks} onKeyDown={handlePerksKeyDown} /> за{' '}
									<strong>{yearlyPrice} в год</strong>.
								</Trans>
							) : (
								<Trans>
									У вас есть все <PerksButton onClick={scrollToPerks} onKeyDown={handlePerksKeyDown} /> на период вашей
									подписки.
								</Trans>
							)}
						</div>

						{currentUser.premiumUntil &&
							!premiumWillCancel &&
							!isInGracePeriod &&
							!isFullyExpired &&
							!isGiftSubscription &&
							premiumUntilFormatted &&
							(() => {
								const renewalDate = premiumUntilFormatted;
								return (
									<div className={styles.renewalInfo}>
										<Trans>
											Продление <strong>{renewalDate}</strong>.
										</Trans>
									</div>
								);
							})()}
					</div>

					<div className={styles.actions}>
						{isGiftSubscription ? (
							<>
								{wrapIfDisabled(
									<Button
										variant="inverted"
										onClick={navigateToRedeemGift}
										small
										fitContent
										className={styles.actionButton}
										disabled={purchaseDisabled}
									>
										<Trans>Активировать подарочный код</Trans>
									</Button>,
									'redeem-gift',
									purchaseDisabled,
								)}
							</>
						) : (
							<>
								{hasEverPurchased &&
									wrapIfDisabled(
										<Button
											variant="inverted"
											onClick={shouldUseReactivateQuickAction ? handleReactivateSubscription : handleOpenCustomerPortal}
											submitting={shouldUseReactivateQuickAction ? loadingReactivate : loadingPortal}
											small
											fitContent
											className={styles.actionButton}
											disabled={purchaseDisabled && shouldUseReactivateQuickAction}
										>
											{isFullyExpired ? (
												<Trans>Возобновить</Trans>
											) : isInGracePeriod ? (
												<Trans>Возобновить</Trans>
											) : premiumWillCancel ? (
												<Trans>Возобновить</Trans>
											) : (
												<Trans>Управление подпиской</Trans>
											)}
										</Button>,
										'manage-reactivate',
										purchaseDisabled && shouldUseReactivateQuickAction,
									)}

								{shouldUseCancelQuickAction && (
									<Button
										variant="inverted"
										onClick={handleCancelSubscription}
										submitting={loadingCancel}
										small
										fitContent
										className={styles.actionButton}
									>
										<Trans>Отменить</Trans>
									</Button>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		);
	},
);
