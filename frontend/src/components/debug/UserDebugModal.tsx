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
import type {UserRecord} from '~/records/UserRecord';
import {DebugModal, type DebugTab} from './DebugModal';

interface UserDebugModalProps {
	title: string;
	user: UserRecord;
}

export const UserDebugModal: React.FC<UserDebugModalProps> = observer(({title, user}) => {
	const {t} = useLingui();
	const recordJsonData = useMemo(() => user.toJSON(), [user]);

	const tabs: Array<DebugTab> = [
		{
			id: 'record',
			label: t`User Record`,
			data: recordJsonData,
		},
	];

	return <DebugModal title={title} tabs={tabs} />;
});
