/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {ClockIcon, XCircleIcon} from '@phosphor-icons/react';
import {DateTime} from 'luxon';
import {observer} from 'mobx-react-lite';
import React from 'react';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {getCurrentLocale} from '~/utils/LocaleUtils';
import styles from './ScheduledMessageEditBar.module.css';
import wrapperStyles from './textarea/InputWrapper.module.css';

interface ScheduledMessageEditBarProps {
	scheduledLocalAt: string;
	timezone: string;
	onCancel: () => void;
}

const formatScheduleLabel = (local: string, timezone: string): string => {
	const locale = getCurrentLocale();
	const dt = DateTime.fromISO(local, {zone: timezone}).setLocale(locale);
	if (!dt.isValid) {
		return `${local} (${timezone})`;
	}
	return `${dt.toLocaleString(DateTime.DATETIME_MED)} (${timezone})`;
};

export const ScheduledMessageEditBar = observer(
	({scheduledLocalAt, timezone, onCancel}: ScheduledMessageEditBarProps) => {
		const {t} = useLingui();
		const scheduleLabel = React.useMemo(
			() => formatScheduleLabel(scheduledLocalAt, timezone),
			[scheduledLocalAt, timezone],
		);

		const handleStopEditing = React.useCallback(() => {
			onCancel();
		}, [onCancel]);

		return (
			<div
				className={`${wrapperStyles.box} ${wrapperStyles.wrapperSides} ${wrapperStyles.roundedTop} ${wrapperStyles.noBottomBorder}`}
			>
				<div className={wrapperStyles.barInner} style={{gridTemplateColumns: '1fr auto'}}>
					<div className={styles.text}>
						<div className={styles.label}>
							<ClockIcon className={styles.icon} weight="fill" />
							<span>{t`Editing scheduled message`}</span>
						</div>
						<div className={styles.timestamp}>{scheduleLabel}</div>
					</div>

					<div className={styles.controls}>
						<FocusRing offset={-2}>
							<button type="button" className={styles.button} onClick={handleStopEditing}>
								<XCircleIcon className={styles.icon} />
							</button>
						</FocusRing>
					</div>
				</div>
				<div className={wrapperStyles.separator} />
			</div>
		);
	},
);
