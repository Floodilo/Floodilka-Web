/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import styles from '~/components/channel/EmojiPicker.module.css';
import {GuildIcon} from '~/components/popouts/GuildIcon';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import type {GuildStickerRecord} from '~/records/GuildStickerRecord';
import GuildStore from '~/stores/GuildStore';

interface StickerPickerCategoryListProps {
	stickersByGuildId: ReadonlyMap<string, ReadonlyArray<GuildStickerRecord>>;
	handleCategoryClick: (category: string) => void;
	horizontal?: boolean;
}

export const StickerPickerCategoryList = observer(
	({stickersByGuildId, handleCategoryClick, horizontal = false}: StickerPickerCategoryListProps) => {
		if (horizontal) {
			return (
				<div className={styles.horizontalCategories}>
					{Array.from(stickersByGuildId.keys()).map((guildId) => {
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
				</div>
			);
		}

		return (
			<div className={styles.categoryList}>
				<div className={styles.categoryListScroll}>
					<div className={styles.listItems}>
						{Array.from(stickersByGuildId.keys()).map((guildId) => {
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
					</div>
				</div>
			</div>
		);
	},
);
