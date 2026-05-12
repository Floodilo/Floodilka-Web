/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {Checkbox} from '~/components/uikit/Checkbox/Checkbox';
import styles from './InviteDateToggle.module.css';

interface InviteDateToggleProps {
	showCreatedDate: boolean;
	onToggle: (showCreatedDate: boolean) => void;
}

export const InviteDateToggle: React.FC<InviteDateToggleProps> = observer(({showCreatedDate, onToggle}) => {
	const handleChange = React.useCallback(
		(isChecked: boolean) => {
			onToggle(isChecked);
		},
		[onToggle],
	);

	return (
		<div className={styles.container}>
			<Checkbox checked={showCreatedDate} onChange={handleChange} size="small">
				<span className={styles.label}>
					<Trans>Show creation date instead of expiration date</Trans>
				</span>
			</Checkbox>
		</div>
	);
});
