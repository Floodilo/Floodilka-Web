/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {MagnifyingGlassIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {StatusAwareAvatar} from '~/components/uikit/StatusAwareAvatar';
import type {UserRecord} from '~/records/UserRecord';
import GuildStore from '~/stores/GuildStore';
import * as NicknameUtils from '~/utils/NicknameUtils';
import {AutocompleteOption} from './AutocompleteOption';
import styles from './MessageSearchBar.module.css';

interface UsersSectionProps {
	options: Array<UserRecord>;
	selectedIndex: number;
	hoverIndex: number;
	onSelect: (user: UserRecord) => void;
	onMouseEnter: (index: number) => void;
	onMouseLeave?: () => void;
	listboxId: string;
	guildId?: string;
	isInGuild: boolean;
}

export const UsersSection: React.FC<UsersSectionProps> = observer(
	({options, selectedIndex, hoverIndex, onSelect, onMouseEnter, onMouseLeave, listboxId, guildId, isInGuild}) => {
		const {t} = useLingui();

		if (options.length === 0) return null;

		return (
			<div className={styles.popoutSection}>
				<div className={styles.popoutSectionHeader}>
					<span className={`${styles.flex} ${styles.itemsCenter} ${styles.gap2}`}>
						<MagnifyingGlassIcon weight="regular" size={14} />
						{t`Users`}
					</span>
				</div>
				{options.map((user: UserRecord, index) => {
					const guild = isInGuild && guildId ? GuildStore.getGuild(guildId) : null;
					const nickname = NicknameUtils.getNickname(user, guild?.id);
					return (
						<AutocompleteOption
							key={user.id}
							index={index}
							isSelected={index === selectedIndex}
							isHovered={index === hoverIndex}
							onSelect={() => onSelect(user)}
							onMouseEnter={() => onMouseEnter(index)}
							onMouseLeave={onMouseLeave}
							listboxId={listboxId}
						>
							<div className={styles.optionLabel}>
								<div className={styles.optionContent}>
									<div className={styles.optionText}>
										<div className={styles.optionTitle}>
											<span className={`${styles.userRow} ${styles.gap1}`}>
												<span className={`${styles.userRow} ${styles.gap2}`}>
													<StatusAwareAvatar user={user} size={16} />
													<span className={`${styles.minW0} ${styles.overflowHidden}`}>{nickname}</span>
												</span>
												<span className={styles.userTag}>{user.tag}</span>
											</span>
										</div>
									</div>
								</div>
							</div>
						</AutocompleteOption>
					);
				})}
			</div>
		);
	},
);
