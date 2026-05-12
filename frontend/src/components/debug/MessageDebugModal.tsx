/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {useMemo} from 'react';
import {MarkdownContext, parse} from '~/lib/markdown/renderers';
import type {MessageRecord} from '~/records/MessageRecord';
import {DebugModal, type DebugTab, SummaryItem} from './DebugModal';

interface MessageDebugModalProps {
	title: string;
	message: MessageRecord;
}

export const MessageDebugModal: React.FC<MessageDebugModalProps> = observer(({title, message}) => {
	const {t} = useLingui();
	const recordJsonData = useMemo(() => message.toJSON(), [message]);

	const astData = useMemo(() => {
		if (!message.content) return null;

		const startTime = performance.now();
		const nodes = parse({
			content: message.content,
			context: MarkdownContext.STANDARD_WITH_JUMBO,
		});
		const endTime = performance.now();

		return {
			nodes,
			parseTime: endTime - startTime,
		};
	}, [message.content]);

	const tabs: Array<DebugTab> = [
		{
			id: 'record',
			label: t`Message Record`,
			data: recordJsonData,
		},
		{
			id: 'ast',
			label: t`Message AST`,
			data: astData?.nodes ?? null,
			summary: astData ? (
				<SummaryItem label={t`Total Parsing Time:`} value={`${astData.parseTime.toFixed(2)} ms`} />
			) : null,
		},
	];

	return <DebugModal title={title} tabs={tabs} />;
});
