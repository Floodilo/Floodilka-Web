/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {AnimatePresence, motion} from 'framer-motion';
import {observer} from 'mobx-react-lite';
import AccessibilityStore from '~/stores/AccessibilityStore';
import {getCurrentLocale} from '~/utils/LocaleUtils';
import styles from './MentionBadge.module.css';

const formatMentionCount = (mentionCount: number) => {
	const locale = getCurrentLocale();

	if (mentionCount > 99 && mentionCount < 1000) {
		return '99+';
	}

	if (mentionCount >= 1000) {
		const formatter = new Intl.NumberFormat(locale, {
			notation: 'compact',
			maximumFractionDigits: 0,
		});
		return formatter.format(mentionCount).replace(/\s/g, '');
	}

	return new Intl.NumberFormat(locale).format(mentionCount);
};

interface MentionBadgeProps {
	mentionCount: number;
	size?: 'small' | 'medium';
}

export const MentionBadge = observer(({mentionCount, size = 'medium'}: MentionBadgeProps) => {
	if (mentionCount === 0) {
		return null;
	}

	return (
		<div className={clsx(styles.badge, size === 'small' ? styles.badgeSmall : styles.badgeMedium)}>
			{formatMentionCount(mentionCount)}
		</div>
	);
});

export const MentionBadgeAnimated = observer(({mentionCount, size = 'medium'}: MentionBadgeProps) => {
	const shouldAnimate = !AccessibilityStore.useReducedMotion;

	if (!shouldAnimate) {
		return mentionCount > 0 ? <MentionBadge mentionCount={mentionCount} size={size} /> : null;
	}

	return (
		<AnimatePresence initial={false} mode="wait">
			{mentionCount > 0 && (
				<motion.div
					initial={{opacity: 0, scale: 0.85}}
					animate={{opacity: 1, scale: 1}}
					exit={{opacity: 0, scale: 0.85}}
					transition={{type: 'spring', stiffness: 500, damping: 22}}
				>
					<MentionBadge mentionCount={mentionCount} size={size} />
				</motion.div>
			)}
		</AnimatePresence>
	);
});
