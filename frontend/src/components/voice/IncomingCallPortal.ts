/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useEffect, useState} from 'react';
import styles from './IncomingCallManager.module.css';

let portalRoot: HTMLElement | null = null;

function createPortalRoot(): HTMLElement | null {
	if (portalRoot && document.body.contains(portalRoot)) {
		return portalRoot;
	}

	const root = document.createElement('div');
	root.className = styles.portalRoot;
	root.dataset.incomingCallPortal = 'true';
	root.dataset.floatingUiPortal = 'true';
	document.body.appendChild(root);
	portalRoot = root;
	return root;
}

export function ensureIncomingCallPortalRoot(): HTMLElement | null {
	return createPortalRoot();
}

export function useIncomingCallPortalRoot(): HTMLElement | null {
	const [root, setRoot] = useState<HTMLElement | null>(() => createPortalRoot());

	useEffect(() => {
		setRoot((prev) => prev ?? createPortalRoot());
	}, []);

	return root;
}
