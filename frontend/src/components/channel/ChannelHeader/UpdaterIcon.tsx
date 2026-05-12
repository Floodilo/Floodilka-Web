/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {t} from '@lingui/core/macro';
import {DownloadSimpleIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import {Platform} from '~/lib/Platform';
import UpdaterStore from '~/stores/UpdaterStore';
import styles from '../ChannelHeader.module.css';

export const UpdaterIcon = observer(() => {
	const store = UpdaterStore;

	const hasActionableNativeUpdate = Platform.isElectron && store.nativeUpdateReady;
	const hasActionableWebUpdate = !!store.updateInfo.web.available && !hasActionableNativeUpdate;

	const tooltip = React.useMemo(() => {
		const version = store.displayVersion;

		if (hasActionableNativeUpdate) {
			return version ? t`Click to install update (${version})` : t`Click to install update`;
		}

		return version ? t`Click to reload and update (${version})` : t`Click to reload and update`;
	}, [hasActionableNativeUpdate, store.displayVersion]);

	const handleClick = React.useCallback(() => {
		void store.applyUpdate();
	}, [store]);

	if (!hasActionableNativeUpdate && !hasActionableWebUpdate) {
		return null;
	}

	return (
		<Tooltip text={tooltip} position="bottom">
			<FocusRing offset={-2}>
				<button type="button" className={styles.updateIconButton} onClick={handleClick} aria-label={tooltip}>
					<DownloadSimpleIcon weight="bold" className={styles.updateIcon} />
				</button>
			</FocusRing>
		</Tooltip>
	);
});
