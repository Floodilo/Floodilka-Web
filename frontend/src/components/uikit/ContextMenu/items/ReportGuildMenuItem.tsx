/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {FlagIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import type {IARContext} from '~/components/modals/IARModal';
import {IARModal} from '~/components/modals/IARModal';
import type {GuildRecord} from '~/records/GuildRecord';
import AuthenticationStore from '~/stores/AuthenticationStore';
import {MenuItem} from '../MenuItem';

interface ReportGuildMenuItemProps {
	guild: GuildRecord;
	onClose: () => void;
}

export const ReportGuildMenuItem: React.FC<ReportGuildMenuItemProps> = observer(({guild, onClose}) => {
	const {t} = useLingui();
	const isOwner = guild.ownerId === AuthenticationStore.currentUserId;

	const handleReportGuild = React.useCallback(() => {
		onClose();
		const context: IARContext = {
			type: 'guild',
			guild,
		};
		ModalActionCreators.push(modal(() => <IARModal context={context} />));
	}, [guild, onClose]);

	if (isOwner) {
		return null;
	}

	return (
		<MenuItem icon={<FlagIcon size={16} />} onClick={handleReportGuild} danger>
			{t`Report Community`}
		</MenuItem>
	);
});
