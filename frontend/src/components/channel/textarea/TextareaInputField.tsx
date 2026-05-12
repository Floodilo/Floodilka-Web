/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import React from 'react';
import * as HighlightActionCreators from '~/actions/HighlightActionCreators';
import {type AutocompleteOption, isChannel} from '~/components/channel/Autocomplete';
import type {ScrollerHandle} from '~/components/uikit/Scroller';
import {useTextareaAutofocus} from '~/hooks/useTextareaAutofocus';
import {TextareaAutosize} from '~/lib/TextareaAutosize';
import styles from './TextareaInput.module.css';

interface TextareaInputFieldProps {
	channelId: string;

	disabled: boolean;
	isMobile: boolean;
	value: string;
	placeholder: string;
	textareaRef: React.RefObject<HTMLTextAreaElement | null>;
	scrollerRef?: React.RefObject<ScrollerHandle | null>;
	shouldStickToBottomRef?: React.MutableRefObject<boolean>;
	isFocused?: boolean;
	isAutocompleteAttached: boolean;
	autocompleteOptions: Array<any>;
	selectedIndex: number;
	onFocus: () => void;
	onBlur: () => void;
	onChange: (value: string) => void;
	onHeightChange: (height: number) => void;
	onCursorMove: () => void;
	onArrowUp: (event: React.KeyboardEvent) => void;
	onEnter: () => void;
	onAutocompleteSelect: (option: AutocompleteOption) => void;
	setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
	className?: string;
	onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const TextareaInputField = React.forwardRef<HTMLTextAreaElement, TextareaInputFieldProps>(
	(
		{
			disabled,
			isMobile,
			value,
			placeholder,
			textareaRef,
			isAutocompleteAttached,
			autocompleteOptions,
			selectedIndex,
			onFocus,
			onBlur,
			onChange,
			onHeightChange,
			onCursorMove,
			onArrowUp,
			onEnter,
			onAutocompleteSelect,
			setSelectedIndex,
			className,
			onKeyDown,
		},
		_ref,
	) => {
		useTextareaAutofocus(textareaRef, isMobile, !disabled);

		const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
			onCursorMove();

			if (isAutocompleteAttached) {
				if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
					event.preventDefault();
					setSelectedIndex((prevIndex) => {
						const newIndex = event.key === 'ArrowUp' ? prevIndex - 1 : prevIndex + 1;
						const clampedIndex = (newIndex + autocompleteOptions.length) % autocompleteOptions.length;
						if (isChannel(autocompleteOptions[clampedIndex])) {
							HighlightActionCreators.highlightChannel(autocompleteOptions[clampedIndex].channel.id);
						} else {
							HighlightActionCreators.clearChannelHighlight();
						}
						return clampedIndex;
					});
				} else if (event.key === 'Tab') {
					event.preventDefault();
					const selectedOption = autocompleteOptions[selectedIndex];
					if (selectedOption) {
						onAutocompleteSelect(selectedOption);
					}
				} else if (event.key === 'Enter') {
					event.preventDefault();
					const selectedOption = autocompleteOptions[selectedIndex];
					if (selectedOption) {
						onAutocompleteSelect(selectedOption);
					}
				}
			} else if (event.key === 'Enter' && !event.shiftKey && !isMobile) {
				event.preventDefault();
				onEnter();
			} else if (event.key === 'ArrowUp') {
				onArrowUp(event);
			}

			if (onKeyDown) {
				onKeyDown(event);
			}
		};

		return (
			<TextareaAutosize
				data-channel-textarea
				spellCheck={true}
				disabled={disabled}
				className={clsx(styles.textarea, disabled && 'pointer-events-none', className)}
				onBlur={onBlur}
				onChange={(event) => onChange(event.target.value)}
				onFocus={onFocus}
				onHeightChange={(h) => onHeightChange(h)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				ref={textareaRef}
				value={value}
			/>
		);
	},
);

TextareaInputField.displayName = 'TextareaInputField';
