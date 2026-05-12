/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {t} from '@lingui/core/macro';
import {useLingui} from '@lingui/react/macro';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import {shouldShowPremiumFeatures} from '~/utils/PremiumUtils';
import styles from './CharacterCounter.module.css';

interface CharacterCounterProps {
	currentLength: number;
	maxLength: number;
	isPremium: boolean;
	premiumMaxLength: number;
	onUpgradeClick: () => void;
	className?: string;
}

export const CharacterCounter = observer(
	({currentLength, maxLength, isPremium, premiumMaxLength, onUpgradeClick, className}: CharacterCounterProps) => {
		const {i18n} = useLingui();

		const remaining = maxLength - currentLength;
		const isOverLimit = remaining < 0;
		const isNearingLimit = remaining < 50;

		const showPremiumFeatures = shouldShowPremiumFeatures();
		const needsPremium = !isPremium && showPremiumFeatures && (isNearingLimit || isOverLimit);

		const tooltipText = needsPremium
			? t(i18n)`${remaining} characters left. Get Premium to write up to ${premiumMaxLength} characters.`
			: isPremium && isOverLimit
				? t(i18n)`Message is too long`
				: t(i18n)`${remaining} characters left`;

		if (needsPremium) {
			return (
				<Tooltip text={tooltipText}>
					<FocusRing offset={-2}>
						<button
							type="button"
							onClick={onUpgradeClick}
							className={clsx(
								styles.counterButton,
								isOverLimit || isNearingLimit ? styles.textDanger : styles.textTertiary,
								className,
							)}
						>
							{remaining}
						</button>
					</FocusRing>
				</Tooltip>
			);
		}

		return (
			<Tooltip text={tooltipText}>
				<span
					className={clsx(
						styles.counterSpan,
						isOverLimit || isNearingLimit ? styles.textDanger : styles.textTertiary,
						className,
					)}
				>
					{remaining}
				</span>
			</Tooltip>
		);
	},
);
