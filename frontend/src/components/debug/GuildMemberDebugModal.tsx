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
import type {GuildMemberRecord} from '~/records/GuildMemberRecord';
import {DebugModal, type DebugTab} from './DebugModal';

interface GuildMemberDebugModalProps {
	title: string;
	member: GuildMemberRecord;
}

export const GuildMemberDebugModal: React.FC<GuildMemberDebugModalProps> = observer(({title, member}) => {
	const {t} = useLingui();
	const recordJsonData = useMemo(() => member.toJSON(), [member]);

	const tabs: Array<DebugTab> = [
		{
			id: 'record',
			label: t`Guild Member Record`,
			data: recordJsonData,
		},
	];

	return <DebugModal title={title} tabs={tabs} />;
});
