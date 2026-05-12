/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {ClockIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import styles from '~/components/channel/EmojiPicker.module.css';
import {GuildIcon} from '~/components/popouts/GuildIcon';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import UnicodeEmojis from '~/lib/UnicodeEmojis';
import type {Emoji} from '~/stores/EmojiStore';
import GuildStore from '~/stores/GuildStore';

interface EmojiPickerCategoryListProps {
	customEmojisByGuildId: Map<string, Array<Emoji>>;
	unicodeEmojisByCategory: Map<string, Array<Emoji>>;
	handleCategoryClick: (category: string) => void;
	showFrequentlyUsedButton: boolean;
	horizontal?: boolean;
}

export const EmojiPickerCategoryList = observer(
	({
		customEmojisByGuildId,
		unicodeEmojisByCategory,
		handleCategoryClick,
		showFrequentlyUsedButton = false,
		horizontal = false,
	}: EmojiPickerCategoryListProps) => {
		const {i18n} = useLingui();
		if (horizontal) {
			return (
				<div className={styles.horizontalCategories}>
					{showFrequentlyUsedButton && (
						<button
							type="button"
							onClick={() => handleCategoryClick('frequently-used')}
							className={clsx(styles.categoryListIcon, styles.textPrimaryMuted)}
							aria-label={i18n._('Frequently Used')}
						>
							<ClockIcon className={styles.iconSize} />
						</button>
					)}
					{Array.from(customEmojisByGuildId.keys()).map((guildId) => {
						const guild = GuildStore.getGuild(guildId)!;
						return (
							<button
								key={guild.id}
								type="button"
								onClick={() => handleCategoryClick(guild.id)}
								className={clsx(styles.categoryListIcon, styles.textPrimaryMuted)}
								aria-label={guild.name}
							>
								<GuildIcon id={guild.id} name={guild.name} icon={guild.icon} className={styles.iconSize} sizePx={24} />
							</button>
						);
					})}
					{Array.from(unicodeEmojisByCategory.keys()).map((category) => {
						const Icon = UnicodeEmojis.getCategoryIcon(category);
						return (
							<button
								key={category}
								type="button"
								onClick={() => handleCategoryClick(category)}
								className={clsx(styles.categoryListIcon, styles.textPrimaryMuted)}
								aria-label={UnicodeEmojis.getCategoryLabel(category, i18n)}
							>
								<Icon className={styles.iconSize} />
							</button>
						);
					})}
				</div>
			);
		}

		return (
			<div className={styles.categoryList}>
				<div className={styles.categoryListScroll}>
					<div className={styles.listItems}>
						{showFrequentlyUsedButton && (
							<Tooltip text={i18n._('Frequently Used')} position="left">
								<button
									type="button"
									onClick={() => handleCategoryClick('frequently-used')}
									className={clsx(styles.categoryListIcon, styles.textPrimaryMuted)}
								>
									<ClockIcon className={styles.iconSize} />
								</button>
							</Tooltip>
						)}
						{Array.from(customEmojisByGuildId.keys()).map((guildId) => {
							const guild = GuildStore.getGuild(guildId)!;
							return (
								<Tooltip key={guild.id} text={guild.name} position="left">
									<button
										type="button"
										onClick={() => handleCategoryClick(guild.id)}
										className={clsx(styles.categoryListIcon, styles.textPrimaryMuted)}
									>
										<GuildIcon
											id={guild.id}
											name={guild.name}
											icon={guild.icon}
											className={styles.iconSize}
											sizePx={24}
										/>
									</button>
								</Tooltip>
							);
						})}
						{Array.from(unicodeEmojisByCategory.keys()).map((category) => {
							const Icon = UnicodeEmojis.getCategoryIcon(category);
							return (
								<Tooltip key={category} text={UnicodeEmojis.getCategoryLabel(category, i18n)} position="left">
									<button
										type="button"
										onClick={() => handleCategoryClick(category)}
										className={clsx(styles.categoryListIcon, styles.textPrimaryMuted)}
									>
										<Icon className={styles.iconSize} />
									</button>
								</Tooltip>
							);
						})}
					</div>
				</div>
			</div>
		);
	},
);
