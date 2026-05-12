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
import type {GuildRecord} from '~/records/GuildRecord';
import {DebugModal, type DebugTab} from './DebugModal';

interface GuildDebugModalProps {
	title: string;
	guild: GuildRecord;
}

export const GuildDebugModal: React.FC<GuildDebugModalProps> = observer(({title, guild}) => {
	const {t} = useLingui();
	const recordJsonData = useMemo(() => guild.toJSON(), [guild]);

	const tabs: Array<DebugTab> = [
		{
			id: 'record',
			label: t`Guild Record`,
			data: recordJsonData,
		},
	];

	return <DebugModal title={title} tabs={tabs} />;
});
