/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {AnimatePresence} from 'framer-motion';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {createPortal} from 'react-dom';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {Toast} from '~/components/uikit/Toast/Toast';
import ToastStore from '~/stores/ToastStore';
import {isMobileExperienceEnabled} from '~/utils/mobileExperience';
import styles from './Toasts.module.css';

export const Toasts = observer(() => {
	const [portalRoot, setPortalRoot] = React.useState<HTMLElement | null>(null);

	React.useEffect(() => {
		const container = document.createElement('div');
		container.id = 'toast-portal-root';
		document.body.appendChild(container);
		setPortalRoot(container);

		return () => {
			document.body.removeChild(container);
		};
	}, []);

	const isMobileExperience = isMobileExperienceEnabled();

	const closeToast = React.useCallback((id: string) => {
		ToastActionCreators.destroyToast(id);
	}, []);

	if (!portalRoot) return null;

	return createPortal(
		<div className={clsx(styles.container, isMobileExperience ? styles.containerMobile : styles.containerDesktop)}>
			<AnimatePresence mode="wait">
				{ToastStore.currentToast && (
					<div key={ToastStore.currentToast.id} className={styles.toastWrapper}>
						<Toast id={ToastStore.currentToast.id} closeToast={closeToast} {...ToastStore.currentToast.data} />
					</div>
				)}
			</AnimatePresence>
		</div>,
		portalRoot,
	);
});
