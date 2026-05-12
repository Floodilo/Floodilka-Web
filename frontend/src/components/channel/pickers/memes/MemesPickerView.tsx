/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {SmileySadIcon} from '@phosphor-icons/react';
import {matchSorter} from 'match-sorter';
import {observer} from 'mobx-react-lite';
import React from 'react';
import gifStyles from '~/components/channel/GifPicker.module.css';
import {useGifVideoPool} from '~/components/channel/GifVideoPool';
import {PickerEmptyState} from '~/components/channel/shared/PickerEmptyState';
import {ExpressionPickerHeaderPortal} from '~/components/popouts/ExpressionPickerPopout';
import {Scroller, type ScrollerHandle} from '~/components/uikit/Scroller';
import {Spinner} from '~/components/uikit/Spinner';
import {useSearchInputAutofocus} from '~/hooks/useSearchInputAutofocus';
import {useWindowFocusVideoControl} from '~/hooks/useWindowFocusVideoControl';
import FavoriteMemeStore from '~/stores/FavoriteMemeStore';
import MemesPickerStore from '~/stores/MemesPickerStore';
import {useScrollerViewport} from '../shared/useScrollerViewport';
import {MemesGrid} from './MemesGrid';
import type {MemesPickerProps} from './MemesPicker';
import {type ContentType, MemesPickerHeader} from './MemesPickerHeader';

interface MemesPickerState {
	searchTerm: string;
	selectedFilter: ContentType;
}

const initialState: MemesPickerState = {
	searchTerm: '',
	selectedFilter: 'all',
};

export const MemesPickerView = observer(({onClose}: MemesPickerProps = {}) => {
	const {t} = useLingui();
	const [state, setState] = React.useState<MemesPickerState>(initialState);

	const favoriteMemes = FavoriteMemeStore.memes;
	const fetched = FavoriteMemeStore.fetched;
	const storeLoading = !fetched;

	const gifAutoPlay = true;
	const videoPool = useGifVideoPool();

	const scrollerRef = React.useRef<ScrollerHandle>(null);
	const searchInputRef = React.useRef<HTMLInputElement>(null);

	useSearchInputAutofocus(searchInputRef);

	const {viewportSize, scrollTop, handleScroll, handleResize, scrollToTop} = useScrollerViewport(scrollerRef);

	useWindowFocusVideoControl({scrollerRef, videoPool, gifAutoPlay});

	React.useEffect(() => {
		scrollToTop();
	}, [state.selectedFilter, state.searchTerm, scrollToTop]);

	const filteredMemes = React.useMemo(() => {
		let memes = [...favoriteMemes];

		if (state.selectedFilter !== 'all') {
			memes = memes.filter((meme) => {
				const contentType = meme.contentType.toLowerCase();
				switch (state.selectedFilter) {
					case 'image':
						return contentType.startsWith('image/') && !contentType.includes('gif') && !meme.isGifv;
					case 'video':
						return contentType.startsWith('video/') && !meme.isGifv;
					case 'audio':
						return contentType.startsWith('audio/');
					case 'gif':
						return contentType.includes('gif') || meme.isGifv;
					default:
						return true;
				}
			});
		}

		if (state.searchTerm) {
			const sortedByMatch = matchSorter(memes, state.searchTerm, {
				keys: ['name', 'altText', 'filename', 'tags'],
				threshold: matchSorter.rankings.CONTAINS,
			});
			const searchIndex = new Map(sortedByMatch.map((meme, index) => [meme.id, index]));

			memes = [...sortedByMatch].sort((a, b) => {
				const frecencyDiff = MemesPickerStore.getFrecencyScoreForMeme(b) - MemesPickerStore.getFrecencyScoreForMeme(a);
				if (frecencyDiff !== 0) return frecencyDiff;
				return (searchIndex.get(a.id) ?? 0) - (searchIndex.get(b.id) ?? 0);
			});
		}

		return memes;
	}, [favoriteMemes, state.selectedFilter, state.searchTerm]);

	const header = (
		<MemesPickerHeader
			searchTerm={state.searchTerm}
			onSearchTermChange={(value) => setState((s) => ({...s, searchTerm: value}))}
			onClearSearch={() => {
				setState((s) => ({...s, searchTerm: ''}));
				searchInputRef.current?.focus();
			}}
			selectedFilter={state.selectedFilter}
			onFilterChange={(filter) => setState((s) => ({...s, selectedFilter: filter}))}
			inputRef={searchInputRef}
		/>
	);

	if (storeLoading) {
		return (
			<div className={gifStyles.gifPickerContainer}>
				<ExpressionPickerHeaderPortal>{header}</ExpressionPickerHeaderPortal>
				<div className={gifStyles.gifPickerMain} style={{display: 'grid', placeItems: 'center'}}>
					<Spinner size="large" />
				</div>
			</div>
		);
	}

	if (favoriteMemes.length === 0) {
		return (
			<div className={gifStyles.gifPickerContainer}>
				<ExpressionPickerHeaderPortal>{header}</ExpressionPickerHeaderPortal>
				<div className={gifStyles.gifPickerMain}>
					<PickerEmptyState
						icon={SmileySadIcon}
						title={t`No Saved Media`}
						description={t`Save some media from messages to get started!`}
					/>
				</div>
			</div>
		);
	}

	if (filteredMemes.length === 0) {
		return (
			<div className={gifStyles.gifPickerContainer}>
				<ExpressionPickerHeaderPortal>{header}</ExpressionPickerHeaderPortal>
				<div className={gifStyles.gifPickerMain}>
					<PickerEmptyState
						icon={SmileySadIcon}
						title={t`No results`}
						description={t`Try a different search term or filter`}
					/>
				</div>
			</div>
		);
	}

	return (
		<div className={gifStyles.gifPickerContainer}>
			<ExpressionPickerHeaderPortal>{header}</ExpressionPickerHeaderPortal>

			<div className={gifStyles.gifPickerMain}>
				<div className={gifStyles.autoSizerWrapper}>
					<Scroller
						ref={scrollerRef}
						className={gifStyles.virtualList}
						onScroll={handleScroll}
						onResize={handleResize}
						fade={false}
						style={{height: '100%', width: '100%'}}
						reserveScrollbarTrack={false}
					>
						{viewportSize.width > 0 && viewportSize.height > 0 && (
							<MemesGrid
								memes={filteredMemes}
								onClose={onClose}
								gifAutoPlay={gifAutoPlay}
								viewportWidth={viewportSize.width}
								viewportHeight={viewportSize.height}
								scrollTop={scrollTop}
							/>
						)}
					</Scroller>
				</div>
			</div>
		</div>
	);
});
