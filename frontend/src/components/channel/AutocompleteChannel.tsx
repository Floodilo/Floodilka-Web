/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';
import * as HighlightActionCreators from '~/actions/HighlightActionCreators';
import * as ChannelUtils from '~/utils/ChannelUtils';
import {type AutocompleteOption, isChannel} from './Autocomplete';
import styles from './AutocompleteChannel.module.css';
import {AutocompleteItem} from './AutocompleteItem';

export const AutocompleteChannel = observer(
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
		const channels = options.filter(isChannel);
		return channels.map((option, index) => (
			<AutocompleteItem
				key={option.channel.id}
				icon={ChannelUtils.getIcon(option.channel, {className: styles.channelIcon})}
				name={option.channel.name}
				isKeyboardSelected={index === keyboardFocusIndex}
				isHovered={index === hoverIndex}
				onSelect={() => onSelect(option)}
				onMouseEnter={() => {
					HighlightActionCreators.highlightChannel(option.channel.id);
					onMouseEnter(index);
				}}
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
