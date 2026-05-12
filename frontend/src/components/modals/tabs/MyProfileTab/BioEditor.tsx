/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {SmileyIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as PremiumModalActionCreators from '~/actions/PremiumModalActionCreators';
import {MAX_BIO_LENGTH_PREMIUM} from '~/Constants';
import {Autocomplete, type AutocompleteOption, type AutocompleteType} from '~/components/channel/Autocomplete';
import {Textarea} from '~/components/form/Input';
import {ExpressionPickerPopout} from '~/components/popouts/ExpressionPickerPopout';
import {CharacterCounter} from '~/components/uikit/CharacterCounter/CharacterCounter';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {PremiumLink} from '~/components/uikit/PremiumLink/PremiumLink';
import {Popout} from '~/components/uikit/Popout/Popout';
import {useMarkdownKeybinds} from '~/hooks/useMarkdownKeybinds';
import {useTextareaAutocompleteKeyboard} from '~/hooks/useTextareaAutocompleteKeyboard';
import styles from './BioEditor.module.css';

interface BioEditorProps {
	value: string;
	onChange: (value: string) => void;
	onEmojiSelect: (emoji: any) => void;
	placeholder?: string;
	maxLength: number;
	disabled?: boolean;
	hasPremium: boolean;
	isPerGuildProfile: boolean;
	isMobile: boolean;
	errorMessage?: string;
	textareaRef: React.RefObject<HTMLTextAreaElement | null>;
	emojiPickerOpen: boolean;
	onEmojiPickerOpenChange: (open: boolean) => void;
	containerRef: React.RefObject<HTMLDivElement | null>;
	autocompleteQuery?: string;
	autocompleteOptions?: Array<AutocompleteOption>;
	autocompleteType?: AutocompleteType;
	selectedIndex?: number;
	isAutocompleteAttached?: boolean;
	setSelectedIndex?: React.Dispatch<React.SetStateAction<number>>;
	onCursorMove?: () => void;
	handleSelect?: (option: AutocompleteOption) => void;
	autocompleteZIndex?: number;
}

export const BioEditor = observer(
	({
		value,
		onChange,
		onEmojiSelect,
		placeholder,
		maxLength,
		disabled,
		hasPremium,
		isPerGuildProfile,
		isMobile,
		errorMessage,
		textareaRef,
		emojiPickerOpen,
		onEmojiPickerOpenChange,
		containerRef,
		autocompleteQuery,
		autocompleteOptions,
		autocompleteType,
		selectedIndex,
		isAutocompleteAttached,
		setSelectedIndex,
		onCursorMove,
		handleSelect,
		autocompleteZIndex,
	}: BioEditorProps) => {
		const {t} = useLingui();
		const [isFocused, setIsFocused] = React.useState(false);
		useMarkdownKeybinds(isFocused);
		const handleBioEmojiSelect = React.useCallback(
			(emoji: any) => {
				onEmojiSelect(emoji);
				onEmojiPickerOpenChange(false);
			},
			[onEmojiSelect, onEmojiPickerOpenChange],
		);

		const {handleKeyDown} = useTextareaAutocompleteKeyboard({
			isAutocompleteAttached: isAutocompleteAttached || false,
			autocompleteOptions: autocompleteOptions || [],
			selectedIndex: selectedIndex || 0,
			setSelectedIndex: setSelectedIndex || (() => {}),
			handleSelect: handleSelect || (() => {}),
		});

		return (
			<div>
				{isAutocompleteAttached && handleSelect && setSelectedIndex && (
					<Autocomplete
						type={autocompleteType || 'emoji'}
						onSelect={handleSelect}
						selectedIndex={selectedIndex || 0}
						options={autocompleteOptions || []}
						setSelectedIndex={setSelectedIndex}
						referenceElement={containerRef.current}
						query={autocompleteQuery || ''}
						zIndex={autocompleteZIndex}
					/>
				)}

				<div ref={containerRef}>
					<Textarea
						ref={textareaRef}
						label={t`About Me`}
						placeholder={placeholder}
						maxLength={maxLength}
						minRows={4}
						maxRows={4}
						showCharacterCount={true}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						onFocus={() => setIsFocused(true)}
						onBlur={() => setIsFocused(false)}
						onKeyDown={handleKeyDown}
						onKeyUp={onCursorMove}
						onClick={onCursorMove}
						error={errorMessage}
						disabled={disabled}
						innerActionButton={
							isMobile ? (
								<FocusRing offset={-2} enabled={!disabled}>
									<button
										type="button"
										onClick={() => onEmojiPickerOpenChange(true)}
										className={clsx(styles.emojiButton, emojiPickerOpen && styles.emojiButtonActive)}
										disabled={disabled}
									>
										<SmileyIcon size={20} weight="fill" />
									</button>
								</FocusRing>
							) : (
								<Popout
									position="bottom-end"
									animationType="none"
									offsetMainAxis={8}
									offsetCrossAxis={0}
									onOpen={() => onEmojiPickerOpenChange(true)}
									onClose={() => onEmojiPickerOpenChange(false)}
									returnFocusRef={textareaRef}
									render={({onClose}) => (
										<ExpressionPickerPopout
											onEmojiSelect={(emoji) => {
												handleBioEmojiSelect(emoji);
												onClose();
											}}
											onClose={onClose}
											visibleTabs={['emojis']}
										/>
									)}
								>
									<FocusRing offset={-2} enabled={!disabled}>
										<button
											type="button"
											className={clsx(styles.emojiButton, emojiPickerOpen && styles.emojiButtonActive)}
											disabled={disabled}
										>
											<SmileyIcon size={20} weight="fill" />
										</button>
									</FocusRing>
								</Popout>
							)
						}
						characterCountTooltip={(_remaining, total, current) => (
							<CharacterCounter
								currentLength={current}
								maxLength={total}
								isPremium={hasPremium}
								premiumMaxLength={MAX_BIO_LENGTH_PREMIUM}
								onUpgradeClick={() => {
									PremiumModalActionCreators.open();
								}}
							/>
						)}
					/>
				</div>
				{!isPerGuildProfile && (
					<div className={styles.description}>
						{hasPremium ? (
							<Trans>You can use links and Markdown to format your text.</Trans>
						) : (
							<Trans>
								You can use links and Markdown to format your text. With <PremiumLink />, you can write up to{' '}
								{MAX_BIO_LENGTH_PREMIUM} characters.
							</Trans>
						)}
					</div>
				)}
				{isPerGuildProfile && (
					<div className={styles.description}>
						<Trans>You can use links and Markdown to format your text.</Trans>
					</div>
				)}
			</div>
		);
	},
);
