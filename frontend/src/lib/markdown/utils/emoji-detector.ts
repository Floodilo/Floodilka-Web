/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import ChannelStore from '~/stores/ChannelStore';
import EmojiStore from '~/stores/EmojiStore';
import * as AvatarUtils from '~/utils/AvatarUtils';
import * as EmojiUtils from '~/utils/EmojiUtils';
import {EmojiKind} from '../parser/types/enums';
import type {EmojiNode} from '../parser/types/nodes';

interface EmojiRenderData {
	url: string | null;
	name: string;
	isAnimated: boolean;
	id?: string;
}

export function getEmojiRenderData(
	emojiNode: EmojiNode,
	guildId?: string,
	disableAnimatedEmoji = false,
): EmojiRenderData {
	const {kind} = emojiNode;
	const emojiName = `:${kind.name}:`;

	if (kind.kind === EmojiKind.Standard) {
		return {
			url: EmojiUtils.getTwemojiURL(kind.codepoints),
			name: emojiName,
			isAnimated: false,
		};
	}

	const {id, animated} = kind;
	const shouldAnimate = !disableAnimatedEmoji && animated;

	const channel = guildId ? ChannelStore.getChannel(guildId) : undefined;
	const disambiguatedEmoji = EmojiStore.getDisambiguatedEmojiContext(channel?.guildId).getById(id);
	const finalEmojiName = `:${disambiguatedEmoji?.name || kind.name}:`;

	return {
		url: AvatarUtils.getEmojiURL({id, animated: shouldAnimate}),
		name: finalEmojiName,
		isAnimated: shouldAnimate,
		id,
	};
}
