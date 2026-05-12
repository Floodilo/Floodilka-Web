/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import MemesPickerStore from '~/stores/MemesPickerStore';
import QuickSwitcherStore from '~/stores/QuickSwitcherStore';
import {computeMasonryColumns} from '../shared/computeColumns';
import {MasonryVirtualGrid} from '../shared/MasonryVirtualGrid';
import {MemeGridItem} from './MemeGridItem';

export const MemesGrid = observer(
	({
		memes,
		onClose,
		gifAutoPlay,
		viewportWidth,
		viewportHeight,
		scrollTop,
	}: {
		memes: Array<any>;
		onClose?: () => void;
		gifAutoPlay: boolean;
		viewportWidth: number;
		viewportHeight: number;
		scrollTop: number;
	}) => {
		const itemGutter = 8;
		const columns = computeMasonryColumns(viewportWidth, itemGutter);

		const data = React.useMemo(
			() =>
				memes.map((meme) => ({
					id: meme.id,
					original: meme,
					width: meme.width ?? 200,
					height: meme.height ?? 200,
				})),
			[memes],
		);

		const itemKeys = React.useMemo(() => data.map((d) => d.id), [data]);

		const handleSelectKey = React.useCallback((itemKey: string) => {
			MemesPickerStore.trackMemeUsage(itemKey);
		}, []);

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
				onSelectItemKey={handleSelectKey}
				getItemKey={(item) => item.id}
				getItemHeight={(item, _index, columnWidth) => columnWidth * (item.height / item.width)}
				renderItem={({item, itemKey, coords, isFocused}) => (
					<MemeGridItem
						key={itemKey}
						meme={item.original}
						coords={coords}
						onClose={onClose}
						gifAutoPlay={gifAutoPlay}
						isFocused={isFocused}
						itemKey={itemKey}
					/>
				)}
			/>
		);
	},
);
