/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {CopySimple, Minus, Square, X} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import React from 'react';
import {getElectronAPI, type NativePlatform} from '~/utils/NativeUtils';
import styles from './NativeTitlebar.module.css';

interface NativeTitlebarProps {
	platform: NativePlatform;
}

export const NativeTitlebar: React.FC<NativeTitlebarProps> = ({platform}) => {
	const [isMaximized, setIsMaximized] = React.useState(false);

	React.useEffect(() => {
		const electronApi = getElectronAPI();
		if (!electronApi) return;

		const unsubscribe = electronApi.onWindowMaximizeChange((maximized: boolean) => {
			setIsMaximized(maximized);
		});

		return () => {
			unsubscribe();
		};
	}, []);

	const handleMinimize = () => {
		const electronApi = getElectronAPI();
		electronApi?.windowMinimize();
	};

	const handleToggleMaximize = () => {
		const electronApi = getElectronAPI();
		if (!electronApi) return;

		electronApi.windowMaximize();
	};

	const handleClose = () => {
		const electronApi = getElectronAPI();
		electronApi?.windowClose();
	};

	const handleDoubleClick = () => {
		handleToggleMaximize();
	};

	return (
		<div className={styles.controls}>
			<button type="button" className={styles.controlButton} onClick={handleMinimize} aria-label="Minimize window">
				<Minus weight="bold" />
			</button>
			<button
				type="button"
				className={styles.controlButton}
				onClick={handleToggleMaximize}
				aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
			>
				{isMaximized ? <CopySimple weight="bold" /> : <Square weight="bold" />}
			</button>
			<button
				type="button"
				className={clsx(styles.controlButton, styles.closeButton)}
				onClick={handleClose}
				aria-label="Close window"
			>
				<X weight="bold" />
			</button>
		</div>
	);
};
