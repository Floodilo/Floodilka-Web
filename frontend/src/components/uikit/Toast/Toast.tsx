/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {motion} from 'framer-motion';
import {observer} from 'mobx-react-lite';
import {useCallback, useEffect} from 'react';
import type {ToastPropsExtended} from '~/components/uikit/Toast';
import styles from './Toast.module.css';

const MINIMUM_TIMEOUT = 1500;

const typeClassMap: Record<string, string> = {
	error: styles.toastError,
	success: styles.toastSuccess,
	info: styles.toastInfo,
};

export const Toast = observer(
	({id, type, children, timeout = 3000, onClick, onTimeout, onClose, closeToast}: ToastPropsExtended) => {
		useEffect(() => {
			const finalTimeout = Math.max(timeout, MINIMUM_TIMEOUT);
			const timer = setTimeout(() => {
				if (onTimeout) onTimeout();
				else closeToast(id);
			}, finalTimeout);
			return () => clearTimeout(timer);
		}, [timeout, onTimeout, closeToast, id]);

		useEffect(() => {
			return () => {
				if (onClose) onClose();
			};
		}, [onClose]);

		const handleClick = useCallback(
			(event: React.MouseEvent) => {
				if (onClick) onClick(event);
				else closeToast(id);
			},
			[onClick, closeToast, id],
		);

		const handleClose = useCallback(
			(event: React.MouseEvent) => {
				event.stopPropagation();
				closeToast(id);
			},
			[closeToast, id],
		);

		return (
			<motion.div
				onClick={handleClick}
				className={`${styles.toast} ${typeClassMap[type ?? 'error'] ?? styles.toastError}`}
				initial={{opacity: 0, y: -100}}
				animate={{opacity: 1, y: 0}}
				exit={{opacity: 0, y: -100}}
				transition={{
					duration: 0.3,
					ease: 'easeOut',
				}}
			>
				<span className={styles.message}>{children}</span>
				<button
					type="button"
					className={styles.closeBtn}
					onClick={handleClose}
					aria-label="Закрыть"
				>
					&times;
				</button>
			</motion.div>
		);
	},
);
