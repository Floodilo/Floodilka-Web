/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {ChannelPinsContent} from '~/components/shared/ChannelPinsContent';
import {BottomSheet} from '~/components/uikit/BottomSheet/BottomSheet';
import type {ChannelRecord} from '~/records/ChannelRecord';

export const ChannelPinsBottomSheet = observer(
	({isOpen, onClose, channel}: {isOpen: boolean; onClose: () => void; channel: ChannelRecord}) => {
		const {t} = useLingui();
		return (
			<BottomSheet isOpen={isOpen} onClose={onClose} title={t`Pinned Messages`} snapPoints={[0, 1]} initialSnap={1}>
				<ChannelPinsContent channel={channel} onJump={onClose} />
			</BottomSheet>
		);
	},
);
