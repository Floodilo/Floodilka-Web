/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {useParams} from '~/lib/router';
import GuildStore from '~/stores/GuildStore';
import * as ColorUtils from '~/utils/ColorUtils';
import * as NicknameUtils from '~/utils/NicknameUtils';
import {StatusAwareAvatar} from '../uikit/StatusAwareAvatar';
import {type AutocompleteOption, isMentionMember, isMentionRole, isMentionUser, isSpecialMention} from './Autocomplete';
import {AutocompleteItem} from './AutocompleteItem';

import styles from './AutocompleteMention.module.css';

export const AutocompleteMention = observer(function AutocompleteMention({
	onSelect,
	keyboardFocusIndex,
	hoverIndex,
	options,
	onMouseEnter,
	onMouseLeave,
	rowRefs,
}: {
	onSelect: (option: AutocompleteOption) => void;
	keyboardFocusIndex: number;
	hoverIndex: number;
	options: Array<AutocompleteOption>;
	onMouseEnter: (index: number) => void;
	onMouseLeave: () => void;
	rowRefs?: React.MutableRefObject<Array<HTMLButtonElement | null>>;
}) {
	const {t} = useLingui();
	const {guildId} = useParams() as {guildId?: string};
	const guild = GuildStore.getGuild(guildId ?? '');
	const members = options.filter(isMentionMember);
	const users = options.filter(isMentionUser);
	const roles = options.filter(isMentionRole);
	const specialMentions = options.filter(isSpecialMention);

	return (
		<>
			{members.length > 0 && (
				<>
					{members.map((option, index) => (
						<AutocompleteItem
							key={option.member.user.id}
							icon={<StatusAwareAvatar user={option.member.user} size={24} guildId={guildId} />}
							name={NicknameUtils.getNickname(option.member.user, guild?.id)}
							description={option.member.user.tag}
							isKeyboardSelected={index === keyboardFocusIndex}
							isHovered={index === hoverIndex}
							onSelect={() => onSelect(option)}
							onMouseEnter={() => onMouseEnter(index)}
							onMouseLeave={onMouseLeave}
							innerRef={
								rowRefs
									? (node) => {
											rowRefs.current[index] = node;
										}
									: undefined
							}
						/>
					))}
					{(users.length > 0 || specialMentions.length > 0 || roles.length > 0) && (
						<div className={styles.divider} aria-hidden={true} />
					)}
				</>
			)}
			{users.length > 0 && (
				<>
					{users.map((option, index) => {
						const currentIndex = members.length + index;
						return (
							<AutocompleteItem
								key={option.user.id}
								icon={<StatusAwareAvatar user={option.user} size={24} />}
								name={option.user.username}
								description={option.user.tag}
								isKeyboardSelected={currentIndex === keyboardFocusIndex}
								isHovered={currentIndex === hoverIndex}
								onSelect={() => onSelect(option)}
								onMouseEnter={() => onMouseEnter(currentIndex)}
								onMouseLeave={onMouseLeave}
								innerRef={
									rowRefs
										? (node) => {
												rowRefs.current[currentIndex] = node;
											}
										: undefined
								}
							/>
						);
					})}
					{(specialMentions.length > 0 || roles.length > 0) && <div className={styles.divider} aria-hidden={true} />}
				</>
			)}
			{specialMentions.length > 0 && (
				<>
					{specialMentions.map((option, index) => {
						const currentIndex = members.length + users.length + index;
						return (
							<AutocompleteItem
								key={option.kind}
								name={option.kind}
								description={
									option.kind === '@everyone'
										? t`Notify everyone who has permission to view this channel.`
										: t`Notify everyone online who has permission to view this channel.`
								}
								isKeyboardSelected={currentIndex === keyboardFocusIndex}
								isHovered={currentIndex === hoverIndex}
								onSelect={() => onSelect(option)}
								onMouseEnter={() => onMouseEnter(currentIndex)}
								onMouseLeave={onMouseLeave}
								innerRef={
									rowRefs
										? (node) => {
												rowRefs.current[currentIndex] = node;
											}
										: undefined
								}
							/>
						);
					})}
					{roles.length > 0 && <div className={styles.divider} aria-hidden={true} />}
				</>
			)}
			{roles.length > 0 &&
				roles.map((option, index) => {
					const currentIndex = members.length + users.length + specialMentions.length + index;
					return (
						<AutocompleteItem
							key={option.role.id}
							name={
								<span style={{color: option.role.color ? ColorUtils.int2rgb(option.role.color) : undefined}}>
									@{option.role.name}
								</span>
							}
							description={t`Notify users with this role who have permission to view this channel.`}
							isKeyboardSelected={currentIndex === keyboardFocusIndex}
							isHovered={currentIndex === hoverIndex}
							onSelect={() => onSelect(option)}
							onMouseEnter={() => onMouseEnter(currentIndex)}
							onMouseLeave={onMouseLeave}
							innerRef={
								rowRefs
									? (node) => {
											rowRefs.current[currentIndex] = node;
										}
									: undefined
							}
						/>
					);
				})}
		</>
	);
});
