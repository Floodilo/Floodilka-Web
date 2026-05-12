/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {ArrowLeftIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import styles from '~/components/channel/GifPicker.module.css';
import {PickerSearchInput} from '~/components/channel/shared/PickerSearchInput';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import type {GifPickerStore} from './GifPickerStore';

export const GifPickerHeader = observer(
	({
		store,
		inputRef,
	}: {
		store: GifPickerStore;
		inputRef: React.RefObject<HTMLInputElement | null> | React.RefObject<HTMLInputElement>;
	}) => {
		const {t} = useLingui();

		if (store.view !== 'default') {
			const title = store.view === 'trending' ? t`Trending GIFs` : t`GIFs`;
			return (
				<div className={styles.searchBarContainer}>
					<div className={styles.searchBarTitleWrapper}>
						<FocusRing offset={-2}>
							<button type="button" className={styles.searchBarBackButton} onClick={store.goToDefaultView}>
								<ArrowLeftIcon weight="regular" />
							</button>
						</FocusRing>
						<div className={styles.searchBarTitle}>{title}</div>
					</div>
				</div>
			);
		}

		const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				event.preventDefault();
				store.flushSearch();
			}
		};

		return (
			<PickerSearchInput
				value={store.searchTerm}
				onChange={store.setSearchTerm}
				placeholder={t`Find the GIF of your dreams`}
				inputRef={inputRef}
				showBackButton={!!store.searchTerm.trim()}
				onBackButtonClick={() => store.setSearchTerm('')}
				onKeyDown={handleKeyDown}
			/>
		);
	},
);
