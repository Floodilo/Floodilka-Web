/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {Button} from '~/components/uikit/Button/Button';
import * as LocaleUtils from '~/utils/LocaleUtils';
import styles from './PricingCard.module.css';

export const PricingCard = observer(
	({
		title,
		price,
		period,
		badge,
		isPopular,
		isSoldOut,
		soldOut,
		owned,
		remainingSlots,
		onSelect,
		buttonText,
		isLoading = false,
		disabled = false,
		className,
	}: {
		title: string;
		price: string;
		period?: string;
		badge?: string;
		isPopular?: boolean;
		isSoldOut?: boolean;
		soldOut?: boolean;
		owned?: boolean;
		remainingSlots?: number;
		onSelect: () => void;
		buttonText?: string;
		isLoading?: boolean;
		disabled?: boolean;
		className?: string;
	}) => {
		const locale = LocaleUtils.getCurrentLocale();
		const formatter = new Intl.NumberFormat(locale);

		const actuallySoldOut = (soldOut ?? isSoldOut ?? false) && !owned;
		const isCardDisabled = disabled || actuallySoldOut || isLoading || owned;

		const handleClick = React.useCallback(() => {
			if (isCardDisabled) return;
			onSelect();
		}, [isCardDisabled, onSelect]);

		const renderButtonLabel = () => {
			if (owned) return <Trans>Уже есть</Trans>;
			if (actuallySoldOut) return <Trans>Продано</Trans>;
			return buttonText || <Trans>Выбрать</Trans>;
		};

		return (
			<div
				className={clsx(
					isPopular ? styles.cardPopular : styles.cardDefault,
					isCardDisabled && styles.disabled,
					className,
				)}
				aria-busy={isLoading}
			>
				{actuallySoldOut && (
					<div className={styles.soldOutBadge}>
						<Trans>Продано</Trans>
					</div>
				)}

				<div className={styles.contentContainer}>
					<div className={styles.titleRow}>
						<h3 className={styles.cardTitle}>{title}</h3>
						{isPopular ? (
							<span className={styles.pill}>
								<Trans>Популярный</Trans>
							</span>
						) : remainingSlots !== undefined && remainingSlots >= 0 && !actuallySoldOut ? (
							<span className={styles.pill}>
								<Trans>Осталось: {formatter.format(remainingSlots)}</Trans>
							</span>
						) : null}
					</div>

					<div className={styles.priceRow}>
						<span className={styles.price}>{price}</span>
						{period && <span className={styles.priceMeta}>{period}</span>}
					</div>
					{badge ? <p className={styles.savingsNote}>{badge}</p> : null}
				</div>

				<Button
					variant={isPopular && !actuallySoldOut ? 'primary' : 'secondary'}
					onClick={handleClick}
					disabled={isCardDisabled}
					submitting={isLoading}
					className={clsx(styles.selectButton, isPopular && !actuallySoldOut && styles.selectButtonPopular)}
					aria-disabled={isCardDisabled}
					aria-label={title}
				>
					{renderButtonLabel()}
				</Button>
			</div>
		);
	},
);
