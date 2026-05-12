/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import markupStyles from '~/styles/Markup.module.css';
import {Parser} from './parser/parser/parser';
import {
	getParserFlagsForContext,
	MarkdownContext,
	type MarkdownParseOptions,
	render,
	wrapRenderedContent,
} from './renderers';

const MarkdownErrorBoundary = class MarkdownErrorBoundary extends React.Component<
	{children: React.ReactNode},
	{hasError: boolean; error: Error | null}
> {
	constructor(props: {children: React.ReactNode}) {
		super(props);
		this.state = {hasError: false, error: null};
	}

	static getDerivedStateFromError(error: Error) {
		return {hasError: true, error};
	}

	override componentDidCatch(error: Error, info: React.ErrorInfo) {
		console.error('Error rendering markdown:', error, info);
	}

	override render() {
		if (this.state.hasError) {
			return (
				<span className={markupStyles.error}>
					<Trans>Error rendering content</Trans>
				</span>
			);
		}

		return this.props.children;
	}
};

function parseMarkdown(
	content: string,
	options: MarkdownParseOptions = {context: MarkdownContext.STANDARD_WITHOUT_JUMBO},
): React.ReactNode {
	try {
		const flags = getParserFlagsForContext(options.context);

		const parser = new Parser(content, flags);
		const {nodes} = parser.parse();

		const renderedContent = render(nodes, options);

		return wrapRenderedContent(renderedContent, options.context);
	} catch (error) {
		console.error(`Error parsing markdown (${options.context}):`, error);
		return <span>{content}</span>;
	}
}

export const SafeMarkdown = observer(function SafeMarkdown({
	content,
	options = {context: MarkdownContext.STANDARD_WITHOUT_JUMBO},
}: {
	content: string;
	options?: MarkdownParseOptions;
}): React.ReactElement {
	return <MarkdownErrorBoundary>{parseMarkdown(content, options)}</MarkdownErrorBoundary>;
});
