/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import React from 'react';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {Spinner} from '~/components/uikit/Spinner';
import styles from './EmojiTooltipContent.module.css';

interface EmojiTooltipContentProps {
	emoji?: React.ReactNode;
	emojiUrl?: string | null;
	emojiAlt?: string;
	emojiKey?: string;
	primaryContent?: React.ReactNode;
	subtext?: React.ReactNode;
	isLoading?: boolean;
	className?: string;
	emojiClassName?: string;
	innerClassName?: string;
	onClick?: () => void;
	interactive?: boolean;
}

export const EmojiTooltipContent = React.forwardRef<HTMLDivElement, EmojiTooltipContentProps>(
	(
		{
			emoji,
			emojiUrl,
			emojiAlt,
			emojiKey,
			primaryContent,
			subtext,
			isLoading = false,
			className,
			emojiClassName,
			innerClassName,
			onClick,
			interactive = false,
		},
		ref,
	) => {
		const renderEmoji = () => {
			if (emoji) {
				return emoji;
			}
			if (emojiUrl) {
				return (
					<img
						key={emojiKey}
						src={emojiUrl}
						alt={emojiAlt}
						draggable={false}
						className={clsx('emoji', styles.emoji, 'jumboable', emojiClassName)}
					/>
				);
			}
			return null;
		};

		const content = (
			<>
				{renderEmoji()}
				{isLoading ? (
					<div className={clsx(styles.textContainer, styles.loading)}>
						<Spinner />
					</div>
				) : (
					<div className={styles.textContainer}>
						{primaryContent}
						{subtext && <div className={styles.subtext}>{subtext}</div>}
					</div>
				)}
			</>
		);

		if (interactive && onClick) {
			return (
				<div ref={ref} className={clsx(styles.container, className)}>
					<FocusRing offset={-2}>
						<button type="button" className={clsx(styles.inner, innerClassName)} onClick={onClick}>
							{content}
						</button>
					</FocusRing>
				</div>
			);
		}

		return (
			<div ref={ref} className={clsx(styles.container, className)}>
				<div className={clsx(styles.inner, innerClassName)}>{content}</div>
			</div>
		);
	},
);

EmojiTooltipContent.displayName = 'EmojiTooltipContent';
