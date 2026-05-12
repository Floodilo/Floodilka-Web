/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {EyeIcon, IdentificationCardIcon, ProhibitIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type {GuildBan} from '~/actions/GuildActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import * as TextCopyActionCreators from '~/actions/TextCopyActionCreators';
import {BanDetailsModal} from '~/components/modals/BanDetailsModal';
import {MenuBottomSheet, type MenuGroupType} from '~/components/uikit/MenuBottomSheet/MenuBottomSheet';
import * as AvatarUtils from '~/utils/AvatarUtils';
import styles from './GuildMemberActionsSheet.module.css';

interface BannedUserActionsSheetProps {
	isOpen: boolean;
	onClose: () => void;
	ban: GuildBan;
	onRevoke: () => void;
}

export const BannedUserActionsSheet: React.FC<BannedUserActionsSheetProps> = observer(
	({isOpen, onClose, ban, onRevoke}) => {
		const {t, i18n} = useLingui();
		const {user} = ban;
		const userTag = user.tag ?? user.username;

		const handleViewDetails = () => {
			onClose();
			ModalActionCreators.push(modal(() => <BanDetailsModal ban={ban} onRevoke={onRevoke} />));
		};

		const handleRevokeBan = () => {
			onClose();
			onRevoke();
		};

		const handleCopyUserId = () => {
			TextCopyActionCreators.copy(i18n, user.id, true);
			onClose();
		};

		const menuGroups: Array<MenuGroupType> = [
			{
				items: [
					{
						icon: <EyeIcon className={styles.icon} weight="bold" />,
						label: t`View Details`,
						onClick: handleViewDetails,
					},
				],
			},
			{
				items: [
					{
						icon: <IdentificationCardIcon className={styles.icon} weight="bold" />,
						label: t`Copy User ID`,
						onClick: handleCopyUserId,
					},
				],
			},
			{
				items: [
					{
						icon: <ProhibitIcon className={styles.icon} weight="bold" />,
						label: t`Revoke Ban`,
						onClick: handleRevokeBan,
						danger: true,
					},
				],
			},
		];

		const avatarUrl = AvatarUtils.getUserAvatarURL(user, false);

		const headerContent = (
			<div className={styles.header}>
				<img src={avatarUrl} alt="" className={styles.headerAvatarImg} />
				<div className={styles.headerInfo}>
					<span className={styles.headerName}>{user.username}</span>
					<span className={styles.headerTag}>{userTag}</span>
				</div>
			</div>
		);

		return <MenuBottomSheet isOpen={isOpen} onClose={onClose} groups={menuGroups} headerContent={headerContent} />;
	},
);
