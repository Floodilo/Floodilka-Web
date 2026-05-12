/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useCallback, useEffect, useRef, useState} from 'react';
import * as AuthenticationActionCreators from '~/actions/AuthenticationActionCreators';

interface UseUsernameSuggestionsOptions {
	globalName: string;
	username: string;
	debounceMs?: number;
}

export function useUsernameSuggestions({globalName, username, debounceMs = 300}: UseUsernameSuggestionsOptions) {
	const [suggestions, setSuggestions] = useState<Array<string>>([]);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const abortControllerRef = useRef<AbortController | null>(null);

	const fetchSuggestions = useCallback(async (displayName: string) => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		if (!displayName || displayName.trim().length === 0) {
			setSuggestions([]);
			return;
		}

		try {
			abortControllerRef.current = new AbortController();
			const fetchedSuggestions = await AuthenticationActionCreators.getUsernameSuggestions(displayName);
			setSuggestions(fetchedSuggestions);
		} catch (error) {
			if (error instanceof Error && error.name !== 'AbortError') {
				console.error('Failed to fetch username suggestions:', error);
			}
			setSuggestions([]);
		}
	}, []);

	useEffect(() => {
		if (username && username.trim().length > 0) {
			setSuggestions([]);
			return;
		}

		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		debounceTimerRef.current = setTimeout(() => {
			fetchSuggestions(globalName);
		}, debounceMs);

		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [globalName, username, debounceMs, fetchSuggestions]);

	return {suggestions};
}
