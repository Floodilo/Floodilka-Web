/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import * as DateUtils from '~/utils/DateUtils';
import styles from './TimestampWithTooltip.module.css';

interface TimestampWithTooltipProps {
	date: Date;
	children: React.ReactNode;
	className?: string;
}

const renderTimeElement = (date: Date, formattedDateTime: string, content: React.ReactNode) => (
	// biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-label improves screen reader output for time
	<time dateTime={date.toISOString()} aria-label={formattedDateTime}>
		{content}
	</time>
);

export const TimestampWithTooltip = observer(({date, children, className}: TimestampWithTooltipProps) => {
	const isMobileLayout = MobileLayoutStore.isEnabled();
	const formattedDateTime = DateUtils.getFormattedDateTimeWithSeconds(date);

	const decoratedChildren = (
		<>
			<i className={styles.hiddenSpacer} aria-hidden="true">
				{' — '}
			</i>
			{children}
		</>
	);

	const timeElement = renderTimeElement(date, formattedDateTime, decoratedChildren);

	return (
		<span className={clsx(className, styles.container)}>
			{isMobileLayout ? (
				timeElement
			) : (
				<Tooltip delay={750} text={formattedDateTime} maxWidth="none">
					{timeElement}
				</Tooltip>
			)}
		</span>
	);
});
