/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import {EmojiPickerCategoryList} from '~/components/channel/emoji-picker/EmojiPickerCategoryList';
import {EMOJI_SPRITE_SIZE} from '~/components/channel/emoji-picker/EmojiPickerConstants';
import {EmojiPickerSearchBar} from '~/components/channel/emoji-picker/EmojiPickerSearchBar';
import {useEmojiCategories} from '~/components/channel/emoji-picker/hooks/useEmojiCategories';
import {useVirtualRows} from '~/components/channel/emoji-picker/hooks/useVirtualRows';
import {VirtualizedRow} from '~/components/channel/emoji-picker/VirtualRow';
import mobileStyles from '~/components/channel/MobileEmojiPicker.module.css';
import {
	ExpressionPickerHeaderPortal,
	useExpressionPickerHeaderPortal,
} from '~/components/popouts/ExpressionPickerPopout';
import {Scroller, type ScrollerHandle} from '~/components/uikit/Scroller';
import {useForceUpdate} from '~/hooks/useForceUpdate';
import {ComponentDispatch} from '~/lib/ComponentDispatch';
import UnicodeEmojis, {EMOJI_SPRITES} from '~/lib/UnicodeEmojis';
import ChannelStore from '~/stores/ChannelStore';
import EmojiStore, {type Emoji, normalizeEmojiSearchQuery} from '~/stores/EmojiStore';

export const MobileEmojiPicker = observer(
	({
		channelId,
		handleSelect,
		externalSearchTerm,
		externalSetSearchTerm,
		hideSearchBar = false,
	}: {
		channelId?: string;
		handleSelect: (emoji: Emoji, shiftKey?: boolean) => void;
		externalSearchTerm?: string;
		externalSetSearchTerm?: (term: string) => void;
		hideSearchBar?: boolean;
	}) => {
		const headerPortalContext = useExpressionPickerHeaderPortal();
		const hasPortal = Boolean(headerPortalContext?.headerPortalElement);

		const [internalSearchTerm, setInternalSearchTerm] = React.useState('');
		const [hoveredEmoji, setHoveredEmoji] = React.useState<Emoji | null>(null);
		const [renderedEmojis, setRenderedEmojis] = React.useState<Array<Emoji>>([]);
		const [allEmojis, setAllEmojis] = React.useState<Array<Emoji>>([]);
		const scrollerRef = React.useRef<ScrollerHandle>(null);
		const emojiRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());

		const channel = channelId ? (ChannelStore.getChannel(channelId) ?? null) : null;
		const categoryRefs = React.useRef<Map<string, HTMLDivElement>>(new Map());
		const forceUpdate = useForceUpdate();
		const skinTone = EmojiStore.skinTone;

		const searchTerm = externalSearchTerm ?? internalSearchTerm;
		const setSearchTerm = externalSetSearchTerm ?? setInternalSearchTerm;
		const normalizedSearchTerm = React.useMemo(() => normalizeEmojiSearchQuery(searchTerm), [searchTerm]);

		const spriteSheetSizes = React.useMemo(() => {
			const nonDiversitySize = [
				`${EMOJI_SPRITE_SIZE * EMOJI_SPRITES.NonDiversityPerRow}px`,
				`${EMOJI_SPRITE_SIZE * Math.ceil(UnicodeEmojis.numNonDiversitySprites / EMOJI_SPRITES.NonDiversityPerRow)}px`,
			].join(' ');

			const diversitySize = [
				`${EMOJI_SPRITE_SIZE * EMOJI_SPRITES.DiversityPerRow}px`,
				`${EMOJI_SPRITE_SIZE * Math.ceil(UnicodeEmojis.numDiversitySprites / EMOJI_SPRITES.DiversityPerRow)}px`,
			].join(' ');

			return {nonDiversitySize, diversitySize};
		}, []);

		React.useEffect(() => {
			const emojis = EmojiStore.search(channel, normalizedSearchTerm).slice();
			setRenderedEmojis(emojis);
		}, [channel, normalizedSearchTerm]);

		React.useEffect(() => {
			const emojis = EmojiStore.search(channel, '').slice();
			setAllEmojis(emojis);
		}, [channel]);

		React.useEffect(() => {
			return ComponentDispatch.subscribe('EMOJI_PICKER_RERENDER', forceUpdate);
		});

		const {customEmojisByGuildId, unicodeEmojisByCategory, favoriteEmojis, frequentlyUsedEmojis} = useEmojiCategories(
			allEmojis,
			renderedEmojis,
		);
		const showFrequentlyUsedButton = frequentlyUsedEmojis.length > 0 && !normalizedSearchTerm;
		const virtualRows = useVirtualRows(
			normalizedSearchTerm,
			renderedEmojis,
			favoriteEmojis,
			frequentlyUsedEmojis,
			customEmojisByGuildId,
			unicodeEmojisByCategory,
			8,
		);

		const handleCategoryClick = (category: string) => {
			const element = categoryRefs.current.get(category);
			if (element) {
				scrollerRef.current?.scrollIntoViewNode({node: element, shouldScrollToStart: true});
			}
		};

		const handleHover = (emoji: Emoji | null) => {
			setHoveredEmoji(emoji);
		};

		const searchBar = !hideSearchBar ? (
			<EmojiPickerSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} hoveredEmoji={hoveredEmoji} />
		) : null;

		return (
			<div className={mobileStyles.container}>
				{hasPortal && searchBar ? <ExpressionPickerHeaderPortal>{searchBar}</ExpressionPickerHeaderPortal> : null}
				<div className={mobileStyles.mobileEmojiPicker}>
					{!hasPortal && searchBar}
					<div className={mobileStyles.bodyWrapper}>
						<div className={mobileStyles.emojiPickerListWrapper} role="presentation">
							<Scroller
								ref={scrollerRef}
								className={`${mobileStyles.list} ${mobileStyles.listWrapper}`}
								key="mobile-emoji-picker-scroller"
							>
								{virtualRows.map((row) => (
									<div
										key={`${row.type}-${row.index}`}
										ref={
											row.type === 'header'
												? (el) => {
														if (el && 'category' in row) {
															categoryRefs.current.set(row.category, el);
														}
													}
												: undefined
										}
									>
										<VirtualizedRow
											row={row}
											handleHover={handleHover}
											handleSelect={handleSelect}
											skinTone={skinTone}
											spriteSheetSizes={spriteSheetSizes}
											channel={channel}
											gridColumns={8}
											hoveredEmoji={hoveredEmoji}
											selectedRow={-1}
											selectedColumn={-1}
											emojiRowIndex={0}
											emojiRefs={emojiRefs}
										/>
									</div>
								))}
							</Scroller>
						</div>
					</div>
					<div className={mobileStyles.categoryListBottom}>
						<EmojiPickerCategoryList
							customEmojisByGuildId={customEmojisByGuildId}
							unicodeEmojisByCategory={unicodeEmojisByCategory}
							handleCategoryClick={handleCategoryClick}
							horizontal={true}
							showFrequentlyUsedButton={showFrequentlyUsedButton}
						/>
					</div>
				</div>
			</div>
		);
	},
);
