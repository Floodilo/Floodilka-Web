/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';
import type {AutocompleteOption} from './Autocomplete';
import {isSticker} from './Autocomplete';
import styles from './AutocompleteEmoji.module.css';
import {AutocompleteItem} from './AutocompleteItem';

export const AutocompleteSticker = observer(
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
		const stickers = options.filter(isSticker);
		return stickers.map((option, index) => (
			<AutocompleteItem
				key={option.sticker.id}
				name={option.sticker.name}
				description={
					option.sticker.tags.length > 0 ? option.sticker.tags.join(', ') : option.sticker.description || undefined
				}
				icon={
					<div className={styles.stickerIconWrapper}>
						<img draggable={false} className={styles.stickerIcon} src={option.sticker.url} alt={option.sticker.name} />
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
