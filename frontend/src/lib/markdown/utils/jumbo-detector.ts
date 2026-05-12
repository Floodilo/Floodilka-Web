/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import UnicodeEmojis from '~/lib/UnicodeEmojis';
import UserSettingsStore from '~/stores/UserSettingsStore';
import {NodeType} from '../parser/types/enums';
import type {Node, TextNode} from '../parser/types/nodes';

export function shouldRenderJumboEmojis(nodes: Array<Node>): boolean {
	if (UserSettingsStore.getMessageDisplayCompact()) {
		return false;
	}

	const emojiCount = nodes.filter((node) => {
		return (
			node.type === NodeType.Emoji ||
			(node.type === NodeType.Text && UnicodeEmojis.EMOJI_NAME_RE.test((node as TextNode).content))
		);
	}).length;

	return (
		emojiCount > 0 &&
		emojiCount <= 6 &&
		nodes.every((node) => {
			return (
				node.type === NodeType.Emoji ||
				(node.type === NodeType.Text &&
					((node as TextNode).content.trim() === '' || UnicodeEmojis.EMOJI_NAME_RE.test((node as TextNode).content)))
			);
		})
	);
}
