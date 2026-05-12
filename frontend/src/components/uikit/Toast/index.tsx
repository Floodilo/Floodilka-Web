/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ReactNode} from 'react';

type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
	type: ToastType;
	children: ReactNode;
	timeout?: number;
	onClick?: (event: React.MouseEvent) => void;
	onTimeout?: () => void;
	onClose?: () => void;
}

export type ToastPropsExtended = ToastProps & {
	id: string;
	closeToast: (id: string) => void;
};
