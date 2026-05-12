/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {useMemo} from 'react';
import type {ChannelRecord} from '~/records/ChannelRecord';
import {DebugModal, type DebugTab} from './DebugModal';

interface ChannelDebugModalProps {
	title: string;
	channel: ChannelRecord;
}

export const ChannelDebugModal: React.FC<ChannelDebugModalProps> = observer(({title, channel}) => {
	const {t} = useLingui();
	const recordJsonData = useMemo(() => channel.toJSON(), [channel]);

	const tabs: Array<DebugTab> = [
		{
			id: 'record',
			label: t`Channel Record`,
			data: recordJsonData,
		},
	];

	return <DebugModal title={title} tabs={tabs} />;
});
