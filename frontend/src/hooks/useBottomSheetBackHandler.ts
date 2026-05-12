/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useEffect, useRef} from 'react';
import * as RouterUtils from '~/utils/RouterUtils';

let globalCleanupInProgress = false;

export const useBottomSheetBackHandler = (isOpen: boolean, onClose: () => void, disableHistoryManagement = false) => {
	const historyEntryPushedRef = useRef(false);
	const closedViaBackButtonRef = useRef(false);
	const onCloseRef = useRef(onClose);

	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		if (!isOpen) {
			historyEntryPushedRef.current = false;
			closedViaBackButtonRef.current = false;
			return;
		}

		if (disableHistoryManagement) {
			return;
		}

		if (historyEntryPushedRef.current) {
			return;
		}

		const historyStateId = `bottom-sheet-${Date.now()}`;
		const history = RouterUtils.getHistory();

		if (!history) {
			return;
		}

		const currentState = history.getLocation().state as {bottomSheet?: string} | null;
		const isReplacingSheet = currentState?.bottomSheet;

		const currentUrl = new URL(window.location.pathname + window.location.search, window.location.origin);

		if (isReplacingSheet) {
			history.replace(currentUrl, {
				bottomSheet: historyStateId,
			});
		} else {
			history.push(currentUrl, {
				bottomSheet: historyStateId,
			});
			historyEntryPushedRef.current = true;
		}

		const handlePopState = (event: PopStateEvent) => {
			if (globalCleanupInProgress) {
				return;
			}

			const state = event.state as {bottomSheet?: string};
			if (historyEntryPushedRef.current && state?.bottomSheet !== historyStateId) {
				if (state?.bottomSheet) {
					return;
				}
				closedViaBackButtonRef.current = true;
				historyEntryPushedRef.current = false;
				onCloseRef.current();
			}
		};

		window.addEventListener('popstate', handlePopState);

		return () => {
			if (disableHistoryManagement) {
				return;
			}

			const history = RouterUtils.getHistory();
			if (!history) {
				window.removeEventListener('popstate', handlePopState);
				return;
			}

			if (historyEntryPushedRef.current && !closedViaBackButtonRef.current) {
				historyEntryPushedRef.current = false;
				globalCleanupInProgress = true;
				window.removeEventListener('popstate', handlePopState);
				history.back();
				setTimeout(() => {
					globalCleanupInProgress = false;
				}, 100);
			} else if (!closedViaBackButtonRef.current) {
				window.removeEventListener('popstate', handlePopState);
				const cleanUrl = new URL(window.location.pathname + window.location.search, window.location.origin);
				history.replace(cleanUrl, {});
			} else {
				window.removeEventListener('popstate', handlePopState);
			}
		};
	}, [isOpen, disableHistoryManagement]);
};
