/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';
import type {TextNode} from '../parser/types/nodes';
import {MarkdownContext, type RendererProps} from '.';

export const TextRenderer = observer(function TextRenderer({
	node,
	id,
	options,
}: RendererProps<TextNode>): React.ReactElement {
	let content = node.content;

	if (options.context === MarkdownContext.RESTRICTED_INLINE_REPLY) {
		content = content.replace(/\n/g, ' ').replace(/\s+/g, ' ');
	}

	return <span key={id}>{content}</span>;
});
