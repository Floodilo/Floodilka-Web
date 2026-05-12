/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {TrashIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ChannelStickerActionCreators from '~/actions/ChannelStickerActionCreators';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import {ComponentDispatch} from '~/lib/ComponentDispatch';
import ChannelStickerStore from '~/stores/ChannelStickerStore';
import styles from './ChannelStickersArea.module.css';

interface ChannelStickersAreaProps {
	channelId: string;
	hasAttachments: boolean;
}

export const ChannelStickersArea: React.FC<ChannelStickersAreaProps> = observer(({channelId, hasAttachments}) => {
	const {t} = useLingui();
	const sticker = ChannelStickerStore.getPendingSticker(channelId);
	const [previousSticker, setPreviousSticker] = React.useState(sticker);

	React.useLayoutEffect(() => {
		if (previousSticker && !sticker) {
			ComponentDispatch.dispatch('FORCE_JUMP_TO_PRESENT');
		} else if (!previousSticker && sticker) {
			ComponentDispatch.dispatch('FORCE_JUMP_TO_PRESENT');
		}

		setPreviousSticker(sticker);
	}, [sticker, previousSticker]);

	if (!sticker) {
		return null;
	}

	const handleRemove = () => {
		ChannelStickerActionCreators.removePendingSticker(channelId);
	};

	return (
		<div className={clsx(styles.container, hasAttachments ? styles.withAttachments : styles.standalone)}>
			<div className={styles.content}>
				<div className={styles.stickerPreview}>
					<img src={sticker.url} alt={sticker.name} className={styles.stickerImage} />
					{sticker.isAnimated() && <div className={styles.gifBadge}>GIF</div>}
				</div>
				<div className={styles.stickerInfo}>
					<div className={styles.stickerName}>:{sticker.name}:</div>
					{sticker.description && <div className={styles.stickerDescription}>{sticker.description}</div>}
				</div>
				<Tooltip text={t`Remove sticker`} position="top">
					<FocusRing offset={-2}>
						<button type="button" onClick={handleRemove} className={styles.removeButton} aria-label={t`Remove sticker`}>
							<TrashIcon weight="regular" className={styles.icon} />
						</button>
					</FocusRing>
				</Tooltip>
			</div>
		</div>
	);
});
