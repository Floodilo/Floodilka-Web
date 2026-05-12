/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {MusicNoteIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import * as EmojiPickerActionCreators from '~/actions/EmojiPickerActionCreators';
import GuildStore from '~/stores/GuildStore';
import {shouldUseNativeEmoji} from '~/utils/EmojiUtils';
import {type AutocompleteOption, isEmoji, isMeme, isSticker} from './Autocomplete';
import styles from './AutocompleteEmoji.module.css';
import {AutocompleteItem} from './AutocompleteItem';

const SectionHeading = observer(({children}: {children: React.ReactNode}) => (
	<div className={styles.sectionHeading}>{children}</div>
));

export const AutocompleteEmoji = observer(
	({
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
	}) => {
		const {t} = useLingui();
		const emojis = options.filter(isEmoji);
		const stickers = options.filter(isSticker);
		const memes = options.filter(isMeme);

		const handleEmojiSelect = (option: AutocompleteOption) => {
			if (isEmoji(option)) EmojiPickerActionCreators.trackEmojiUsage(option.emoji);
			onSelect(option);
		};

		return (
			<>
				{emojis.length > 0 && (
					<>
						<SectionHeading>{t`Emojis`}</SectionHeading>
						{emojis.map((option, index) => {
							const isUnicodeEmoji = !option.emoji.guildId && !option.emoji.id;
							const useNativeRendering = shouldUseNativeEmoji && isUnicodeEmoji;
							return (
								<AutocompleteItem
									key={option.emoji.name}
									name={`:${option.emoji.name}:`}
									description={
										option.emoji.guildId ? GuildStore.getGuild(option.emoji.guildId)?.name : t`Default emoji`
									}
									icon={
										useNativeRendering ? (
											<span className={styles.nativeEmojiIcon}>{option.emoji.surrogates}</span>
										) : (
											<img
												draggable={false}
												className={styles.emojiIcon}
												src={option.emoji.url ?? ''}
												alt={option.emoji.name}
											/>
										)
									}
									isKeyboardSelected={index === keyboardFocusIndex}
									isHovered={index === hoverIndex}
									onSelect={() => handleEmojiSelect(option)}
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
							);
						})}
						{(stickers.length > 0 || memes.length > 0) && <div className={styles.divider} aria-hidden={true} />}
					</>
				)}

				{stickers.length > 0 && (
					<>
						<SectionHeading>{t`Stickers`}</SectionHeading>
						{stickers.map((option, index) => {
							const currentIndex = emojis.length + index;
							return (
								<AutocompleteItem
									key={option.sticker.id}
									name={option.sticker.name}
									description={
										option.sticker.tags.length > 0
											? option.sticker.tags.join(', ')
											: option.sticker.description || undefined
									}
									icon={
										<div className={styles.stickerIconWrapper}>
											<img
												draggable={false}
												className={styles.stickerIcon}
												src={option.sticker.url}
												alt={option.sticker.name}
											/>
										</div>
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
						{memes.length > 0 && <div className={styles.divider} aria-hidden={true} />}
					</>
				)}

				{memes.length > 0 && (
					<>
						<SectionHeading>{t`Media`}</SectionHeading>
						{memes.map((option, index) => {
							const currentIndex = emojis.length + stickers.length + index;
							return (
								<AutocompleteItem
									key={option.meme.id}
									name={option.meme.name}
									description={option.meme.tags.length > 0 ? option.meme.tags.join(', ') : undefined}
									icon={
										<div className={styles.memeIconWrapper}>
											{option.meme.contentType.startsWith('video/') || option.meme.contentType.includes('gif') ? (
												<video src={option.meme.url} className={styles.memeVideo} muted autoPlay loop playsInline />
											) : option.meme.contentType.startsWith('audio/') ? (
												<div className={styles.audioIconWrapper}>
													<MusicNoteIcon className={styles.audioIcon} weight="fill" />
												</div>
											) : (
												<img
													draggable={false}
													className={styles.memeIcon}
													src={option.meme.url}
													alt={option.meme.name}
												/>
											)}
										</div>
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
					</>
				)}
			</>
		);
	},
);
