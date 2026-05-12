/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ExpressionPickerActionCreators from '~/actions/ExpressionPickerActionCreators';
import * as KlipyActionCreators from '~/actions/KlipyActionCreators';
import styles from '~/components/channel/GifPicker.module.css';
import FavoriteMemeStore from '~/stores/FavoriteMemeStore';
import QuickSwitcherStore from '~/stores/QuickSwitcherStore';
import {computeMasonryColumns} from '../shared/computeColumns';
import {MasonryVirtualGrid} from '../shared/MasonryVirtualGrid';
import {GifPickerGridItem} from './GifPickerGridItem';
import type {GifPickerStore} from './GifPickerStore';
import type {GifGridItem} from './types';

const CATEGORY_TILE_WIDTH = 200;
const CATEGORY_TILE_HEIGHT = 96;

function buildSkeletonItems(count: number): Array<GifGridItem> {
	return Array.from({length: count}, (_, i) => ({
		type: 'skeleton',
		key: `skeleton-${i}`,
		width: 200,
		height: 200,
	}));
}

export const GifPickerGrid = observer(
	({
		store,
		onClose,
		autoSendKlipyGifs,
		gifAutoPlay,
		viewportWidth,
		viewportHeight,
		scrollTop,
	}: {
		store: GifPickerStore;
		onClose?: () => void;
		autoSendKlipyGifs: boolean;
		gifAutoPlay: boolean;
		viewportWidth: number;
		viewportHeight: number;
		scrollTop: number;
	}) => {
		const {t} = useLingui();
		const itemGutter = 8;
		const columns = computeMasonryColumns(viewportWidth, itemGutter, {minColumns: 2});

		const favoriteMemes = FavoriteMemeStore.memes;
		const favoriteMemesVersion = favoriteMemes.length;

		const data: Array<GifGridItem> = React.useMemo(() => {
			if (store.isShowingFeatured) {
				const gifvMemes = favoriteMemes.filter(
					(meme) => meme.contentType.includes('gif') || meme.contentType.startsWith('video/'),
				);

				const randomFavoriteMeme =
					gifvMemes.length > 0 ? gifvMemes[Math.floor(Math.random() * gifvMemes.length)] : undefined;

				const items: Array<GifGridItem> = [
					{
						type: 'category',
						categoryKind: 'favorites',
						key: 'favorites',
						id: 'favorites',
						title: t`Favorites`,
						previewUrl: randomFavoriteMeme?.url ?? '',
						previewProxySrc: randomFavoriteMeme?.url ?? '',
						width: CATEGORY_TILE_WIDTH,
						height: CATEGORY_TILE_HEIGHT,
					},
					{
						type: 'category',
						categoryKind: 'trending',
						key: 'trending',
						id: 'trending',
						title: t`Trending GIFs`,
						previewUrl: store.featured.gifs[0]?.url ?? '',
						previewProxySrc: store.featured.gifs[0]?.proxy_src ?? store.featured.gifs[0]?.src ?? '',
						width: CATEGORY_TILE_WIDTH,
						height: CATEGORY_TILE_HEIGHT,
					},
					...store.featured.categories.map((category) => ({
						type: 'category' as const,
						categoryKind: 'category' as const,
						key: category.name,
						id: category.name,
						title: category.name,
						previewUrl: category.src,
						previewProxySrc: category.proxy_src ?? category.src,
						width: CATEGORY_TILE_WIDTH,
						height: CATEGORY_TILE_HEIGHT,
					})),
				];

				return items;
			}

			if (store.loading && store.gifsToRender.length === 0) {
				return buildSkeletonItems(Math.max(columns * 3, 12));
			}

			return store.gifsToRender.map((gif) => ({
				type: 'gif' as const,
				key: gif.id ?? gif.src,
				gif,
			}));
		}, [
			store.isShowingFeatured,
			store.loading,
			store.gifsToRender,
			store.featured,
			columns,
			favoriteMemesVersion,
			favoriteMemes,
		]);

		const itemKeys = React.useMemo(
			() => data.filter((item) => item.type !== 'skeleton').map((item) => item.key),
			[data],
		);

		const handleSelectByKey = React.useCallback(
			(itemKey: string) => {
				const item = data.find((i) => i.key === itemKey);
				if (!item || item.type === 'skeleton') return;

				if (item.type === 'category') {
					if (item.id === 'favorites') {
						ExpressionPickerActionCreators.setTab('memes');
					} else if (item.id === 'trending') {
						store.goToTrending();
					} else {
						store.setSearchTerm(item.id);
					}
					return;
				}

				const {gif} = item;
				if (!gif.id) return;

				KlipyActionCreators.registerShare(gif.id, store.searchTerm);
			},
			[data, store],
		);

		const suggestionsHeight = store.suggestions.length > 0 ? 60 : 0;

		return (
			<MasonryVirtualGrid
				data={data}
				itemKeys={itemKeys}
				columns={columns}
				itemGutter={itemGutter}
				viewportWidth={viewportWidth}
				viewportHeight={viewportHeight}
				scrollTop={scrollTop}
				checkSuspension={() => QuickSwitcherStore.isOpen}
				onSelectItemKey={(key) => {
					handleSelectByKey(key);
				}}
				getItemKey={(item) => item.key}
				getItemHeight={(item, _index, columnWidth) => {
					if (item.type === 'gif') {
						const g = item.gif;
						return columnWidth * (g.height / g.width);
					}
					return columnWidth * (item.height / item.width);
				}}
				extraSections={[
					{
						sectionIndex: 1,
						height: suggestionsHeight,
						render: () =>
							store.suggestions.length > 0 ? (
								<div style={{padding: '10px'}}>
									<div className={styles.suggestionsContainer}>
										{store.suggestions.map((suggestion) => (
											<button
												key={suggestion}
												type="button"
												className={styles.suggestionTag}
												onClick={() => store.setSearchTerm(suggestion)}
											>
												{suggestion}
											</button>
										))}
									</div>
								</div>
							) : null,
					},
				]}
				renderItem={({item, itemKey, coords, isFocused}) => (
					<GifPickerGridItem
						key={itemKey}
						item={item}
						itemKey={itemKey}
						coords={coords}
						isFocused={isFocused}
						onClose={onClose}
						autoSendKlipyGifs={autoSendKlipyGifs}
						gifAutoPlay={gifAutoPlay}
						searchTerm={store.searchTerm}
						onShowTrending={store.goToTrending}
						onSearchCategory={store.setSearchTerm}
					/>
				)}
			/>
		);
	},
);
