/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import * as NagbarActionCreators from '~/actions/NagbarActionCreators';
import {Button} from '~/components/uikit/Button/Button';
import type {NagbarStore, NagbarToggleKey} from '~/stores/NagbarStore';
import styles from './NagbarsTab.module.css';
import {getNagbarControls, type NagbarControlDefinition} from './nagbarControls';

interface NagbarsTabContentProps {
	nagbarState: NagbarStore;
}

const NagbarRow: React.FC<{
	control: NagbarControlDefinition;
	nagbarState: NagbarStore;
}> = observer(({control, nagbarState}) => {
	const {t} = useLingui();
	const getFlag = (key: NagbarToggleKey): boolean => Boolean(nagbarState[key]);
	const useActualDisabled = control.useActualDisabled?.(nagbarState) ?? control.resetKeys.every((key) => !getFlag(key));
	const forceShowDisabled = control.forceShowDisabled?.(nagbarState) ?? getFlag(control.forceKey);
	const forceHideDisabled = control.forceHideDisabled?.(nagbarState) ?? getFlag(control.forceHideKey);

	const handleUseActual = () => {
		control.resetKeys.forEach((key) => NagbarActionCreators.resetNagbar(key));
		NagbarActionCreators.setForceHideNagbar(control.forceHideKey, false);
	};

	const handleForceShow = () => {
		NagbarActionCreators.dismissNagbar(control.forceKey);
		NagbarActionCreators.setForceHideNagbar(control.forceHideKey, false);
	};

	const handleForceHide = () => {
		NagbarActionCreators.setForceHideNagbar(control.forceHideKey, true);
		NagbarActionCreators.resetNagbar(control.forceKey);
	};

	return (
		<div className={styles.nagbarItem}>
			<div className={styles.nagbarInfo}>
				<span className={styles.nagbarLabel}>{control.label}</span>
				<span className={styles.nagbarStatus}>{control.status(nagbarState)}</span>
			</div>
			<div className={styles.buttonGroup}>
				<Button onClick={handleUseActual} disabled={useActualDisabled}>
					{t`Use Actual`}
				</Button>
				<Button onClick={handleForceShow} disabled={forceShowDisabled}>
					{t`Force Show`}
				</Button>
				<Button onClick={handleForceHide} disabled={forceHideDisabled}>
					{t`Force Hide`}
				</Button>
			</div>
		</div>
	);
});

export const NagbarsTabContent: React.FC<NagbarsTabContentProps> = observer(({nagbarState}) => {
	const {t} = useLingui();
	const nagbarControls = getNagbarControls(t);

	return (
		<div className={styles.nagbarList}>
			{nagbarControls.map((control) => (
				<NagbarRow key={control.key} control={control} nagbarState={nagbarState} />
			))}

			<div className={styles.footer}>
				<Button
					onClick={() => NagbarActionCreators.resetAllNagbars()}
					variant="secondary"
				>{t`Reset All Nagbars`}</Button>
			</div>
		</div>
	);
});
