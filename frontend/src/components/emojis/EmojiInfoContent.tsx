/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import {EmojiAttributionSubtext, getEmojiAttribution} from '~/components/emojis/EmojiAttributionSubtext';
import type {Emoji} from '~/stores/EmojiStore';
import GuildStore from '~/stores/GuildStore';
import styles from './EmojiInfoContent.module.css';

interface EmojiInfoContentProps {
	emoji: Emoji;
}

export const EmojiInfoContent = observer(function EmojiInfoContent({emoji}: EmojiInfoContentProps) {
	const guild = emoji.guildId ? GuildStore.getGuild(emoji.guildId) : null;
	const attribution = getEmojiAttribution({
		emojiId: emoji.id,
		guildId: emoji.guildId,
		guild,
		emojiName: emoji.name,
	});

	return (
		<EmojiAttributionSubtext
			attribution={attribution}
			classes={{
				container: styles.container,
				text: styles.text,
				guildRow: styles.guildRow,
				guildIcon: styles.guildIcon,
				guildName: styles.guildName,
				verifiedIcon: styles.verifiedIcon,
			}}
		/>
	);
});
