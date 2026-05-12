/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import styles from '~/components/channel/EmojiPicker.module.css';
import type {GuildStickerRecord} from '~/records/GuildStickerRecord';

interface StickerPickerInspectorProps {
	hoveredSticker: GuildStickerRecord | null;
}

export const StickerPickerInspector = observer(({hoveredSticker}: StickerPickerInspectorProps) => {
	return (
		<div className={styles.inspector}>
			{hoveredSticker && (
				<>
					<img src={hoveredSticker.url} alt={hoveredSticker.name} className={styles.inspectorEmoji} />
					<span className={styles.inspectorText}>{hoveredSticker.name}</span>
				</>
			)}
		</div>
	);
});
