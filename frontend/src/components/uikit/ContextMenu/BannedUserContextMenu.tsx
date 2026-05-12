/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {EyeIcon, ProhibitIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import type {GuildBan} from '~/actions/GuildActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {BanDetailsModal} from '~/components/modals/BanDetailsModal';
import {MenuGroup} from './MenuGroup';
import {MenuItem} from './MenuItem';

interface BannedUserContextMenuProps {
	ban: GuildBan;
	onClose: () => void;
	onRevoke: () => void;
}

export const BannedUserContextMenu: React.FC<BannedUserContextMenuProps> = observer(({ban, onClose, onRevoke}) => {
	const handleViewDetails = () => {
		onClose();
		ModalActionCreators.push(modal(() => <BanDetailsModal ban={ban} onRevoke={onRevoke} />));
	};

	const handleRevokeBan = () => {
		onClose();
		onRevoke();
	};

	return (
		<>
			<MenuGroup>
				<MenuItem icon={<EyeIcon weight="bold" />} onClick={handleViewDetails}>
					<Trans>View Details</Trans>
				</MenuItem>
			</MenuGroup>
			<MenuGroup>
				<MenuItem icon={<ProhibitIcon weight="bold" />} danger onClick={handleRevokeBan}>
					<Trans>Revoke Ban</Trans>
				</MenuItem>
			</MenuGroup>
		</>
	);
});
