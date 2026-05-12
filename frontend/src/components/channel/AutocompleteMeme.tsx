/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {MusicNoteIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {type AutocompleteOption, isMeme} from './Autocomplete';
import styles from './AutocompleteEmoji.module.css';
import {AutocompleteItem} from './AutocompleteItem';

export const AutocompleteMeme = observer(
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
		const memes = options.filter(isMeme);
		return memes.map((option, index) => (
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
							<img draggable={false} className={styles.memeIcon} src={option.meme.url} alt={option.meme.name} />
						)}
					</div>
				}
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
		));
	},
);
