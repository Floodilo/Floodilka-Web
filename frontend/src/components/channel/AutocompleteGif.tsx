/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {Scroller, type ScrollerHandle} from '~/components/uikit/Scroller';
import * as KlipyUtils from '~/utils/KlipyUtils';
import {type AutocompleteOption, isGif} from './Autocomplete';

import styles from './AutocompleteGif.module.css';

export const AutocompleteGif = observer(
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
		const gifs = options.filter(isGif);
		const scrollerRef = React.useRef<ScrollerHandle>(null);

		const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
			switch (event.key) {
				case 'ArrowDown':
				case 'ArrowUp': {
					event.preventDefault();
					break;
				}
			}
		}, []);

		React.useLayoutEffect(() => {
			const selectedElement = rowRefs?.current[keyboardFocusIndex];
			if (selectedElement && scrollerRef.current) {
				scrollerRef.current.scrollIntoViewNode({
					node: selectedElement,
					shouldScrollToStart: false,
					padding: 0,
				});
			}
		}, [keyboardFocusIndex, rowRefs?.current[keyboardFocusIndex]]);

		if (gifs.length === 0) {
			return <div className={styles.empty}>{t`No GIFs found`}</div>;
		}

		return (
			<div className={styles.container} onKeyDown={handleKeyDown} role="application">
				<div className={styles.heading}>{t`GIFs`}</div>

				<Scroller
					ref={scrollerRef}
					className={styles.scroller}
					orientation="horizontal"
					fade={false}
					key="autocomplete-gif-scroller"
				>
					{gifs.map((option, index) => {
						const gif = option.gif;
						const title = gif.title || KlipyUtils.parseTitleFromUrl(gif.url);
						const isActive = index === keyboardFocusIndex || index === hoverIndex;
						return (
							<button
								type="button"
								key={gif.id}
								ref={(node) => {
									if (rowRefs) {
										rowRefs.current[index] = node;
									}
								}}
								className={`${styles.gifButton} ${isActive ? styles.gifButtonSelected : ''}`}
								onClick={() => onSelect(option)}
								onMouseEnter={() => onMouseEnter(index)}
								onMouseLeave={onMouseLeave}
								aria-label={`${title} - ${t`From Klipy`}`}
							>
								<div className={styles.gifVideoWrapper}>
									<video src={gif.proxy_src} className={styles.gifVideo} muted autoPlay loop playsInline />
								</div>
							</button>
						);
					})}
				</Scroller>
			</div>
		);
	},
);
