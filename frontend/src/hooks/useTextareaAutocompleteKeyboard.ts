/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import type {AutocompleteOption} from '~/components/channel/Autocomplete';

export function useTextareaAutocompleteKeyboard({
	isAutocompleteAttached,
	autocompleteOptions,
	selectedIndex,
	setSelectedIndex,
	handleSelect,
}: {
	isAutocompleteAttached: boolean;
	autocompleteOptions: Array<AutocompleteOption>;
	selectedIndex: number;
	setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
	handleSelect: (option: AutocompleteOption) => void;
}) {
	const handleKeyDown = React.useCallback(
		(event: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (!isAutocompleteAttached || !autocompleteOptions.length) {
				return;
			}

			if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
				event.preventDefault();
				setSelectedIndex((prevIndex) => {
					const newIndex = event.key === 'ArrowUp' ? prevIndex - 1 : prevIndex + 1;
					return (newIndex + autocompleteOptions.length) % autocompleteOptions.length;
				});
			} else if (event.key === 'Tab' || event.key === 'Enter') {
				event.preventDefault();
				const selectedOption = autocompleteOptions[selectedIndex];
				if (selectedOption) {
					handleSelect(selectedOption);
				}
			}
		},
		[isAutocompleteAttached, autocompleteOptions, selectedIndex, setSelectedIndex, handleSelect],
	);

	return {handleKeyDown};
}
