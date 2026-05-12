/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ToastProps} from '~/components/uikit/Toast';
import ToastStore from '~/stores/ToastStore';

export const createToast = (data: ToastProps): string => {
	return ToastStore.createToast(data);
};

export const destroyToast = (id: string): void => {
	ToastStore.destroyToast(id);
};

export const success = (message: string): string => {
	return ToastStore.success(message);
};

export const error = (message: string): string => {
	return ToastStore.error(message);
};
