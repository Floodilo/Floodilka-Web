/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {PencilIcon, XIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import * as GuildStickerActionCreators from '~/actions/GuildStickerActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {GuildFeatures} from '~/Constants';
import {ConfirmModal} from '~/components/modals/ConfirmModal';
import {EditGuildStickerModal} from '~/components/modals/EditGuildStickerModal';
import {Checkbox} from '~/components/uikit/Checkbox/Checkbox';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import {type GuildStickerWithUser, isStickerAnimated} from '~/records/GuildStickerRecord';
import GuildStore from '~/stores/GuildStore';
import * as AvatarUtils from '~/utils/AvatarUtils';
import styles from './StickerGridItem.module.css';

type StickerGridItemProps = {
	guildId: string;
	sticker: GuildStickerWithUser;
	onUpdate: () => void;
};

export const StickerGridItem = observer(function StickerGridItem({guildId, sticker, onUpdate}: StickerGridItemProps) {
	const {t} = useLingui();

	const stickerName = sticker.name;
	const guild = GuildStore.getGuild(guildId);
	const canExpressionPurge = guild?.features.has(GuildFeatures.EXPRESSION_PURGE_ALLOWED) ?? false;

	const handleEdit = () => {
		ModalActionCreators.push(
			ModalActionCreators.modal(() => (
				<EditGuildStickerModal guildId={guildId} sticker={sticker} onUpdate={onUpdate} />
			)),
		);
	};

	const handleDelete = () => {
		ModalActionCreators.push(
			ModalActionCreators.modal(() => (
				<ConfirmModal
					title={t`Delete Sticker`}
					description={t`Are you sure you want to delete "${stickerName}"? This action cannot be undone.`}
					primaryText={t`Delete`}
					primaryVariant="danger-primary"
					checkboxContent={
						canExpressionPurge ? <Checkbox>{t`Purge this sticker from storage and CDN`}</Checkbox> : undefined
					}
					onPrimary={async (checkboxChecked = false) => {
						await GuildStickerActionCreators.remove(
							guildId,
							sticker.id,
							Boolean(checkboxChecked) && canExpressionPurge,
						);
						onUpdate();
					}}
				/>
			)),
		);
	};

	const stickerUrl = AvatarUtils.getStickerURL({
		id: sticker.id,
		animated: isStickerAnimated(sticker),
		size: 320,
	});
	const avatarUrl = sticker.user ? AvatarUtils.getUserAvatarURL(sticker.user, false) : null;

	return (
		<div className={styles.container}>
			<div className={styles.stickerWrapper}>
				<img src={stickerUrl} alt={stickerName} className={styles.stickerImage} loading="lazy" />
			</div>

			<div className={styles.content}>
				<div className={styles.header}>
					<span className={styles.stickerName}>{stickerName}</span>
					{isStickerAnimated(sticker) && (
						<span className={styles.gifBadge}>
							<Trans>GIF</Trans>
						</span>
					)}
				</div>

				{sticker.user && avatarUrl && (
					<div className={styles.authorInfo}>
						<img src={avatarUrl} alt="" className={styles.authorAvatar} loading="lazy" />
						<span className={styles.authorName}>{sticker.user.username}</span>
					</div>
				)}
			</div>

			<div className={styles.actions}>
				<Tooltip text={t`Edit`}>
					<FocusRing offset={-2}>
						<button type="button" onClick={handleEdit} className={styles.actionButton}>
							<PencilIcon className={styles.icon} weight="bold" />
						</button>
					</FocusRing>
				</Tooltip>

				<Tooltip text={t`Delete`}>
					<FocusRing offset={-2}>
						<button type="button" onClick={handleDelete} className={clsx(styles.actionButton, styles.deleteButton)}>
							<XIcon className={styles.icon} weight="bold" />
						</button>
					</FocusRing>
				</Tooltip>
			</div>
		</div>
	);
});
