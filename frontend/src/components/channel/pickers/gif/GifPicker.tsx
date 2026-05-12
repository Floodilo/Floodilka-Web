/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {GifVideoPoolProvider} from '~/components/channel/GifVideoPool';
import {GifPickerView} from './GifPickerView';

export interface GifPickerProps {
	onClose?: () => void;
}

export const GifPicker = ({onClose}: GifPickerProps = {}) => (
	<GifVideoPoolProvider>
		<GifPickerView onClose={onClose} />
	</GifVideoPoolProvider>
);
