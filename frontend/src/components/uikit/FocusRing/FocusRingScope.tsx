/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import * as React from 'react';
import styles from './FocusRing.module.css';
import FocusRingContext, {FocusRingContextManager} from './FocusRingContext';
import FocusRingManager from './FocusRingManager';

interface FocusRingScopeProps {
	containerRef: React.RefObject<Element | null>;
	children: React.ReactNode;
}

export default function FocusRingScope(props: FocusRingScopeProps) {
	const {containerRef, children} = props;
	const manager = React.useRef(new FocusRingContextManager());

	React.useEffect(() => {
		manager.current.setContainer(containerRef.current);
	}, [containerRef]);

	return (
		<FocusRingContext.Provider value={manager.current}>
			{children}
			<Ring />
		</FocusRingContext.Provider>
	);
}

function Ring() {
	const ringContext = React.useContext(FocusRingContext);
	const [, forceUpdate] = React.useReducer((x: number) => x + 1, 0);

	React.useEffect(() => {
		ringContext.invalidate = () => forceUpdate();
		return () => {
			ringContext.invalidate = () => null;
		};
	}, [ringContext]);

	if (!FocusRingManager.ringsEnabled || !ringContext.visible) return null;

	return <div className={clsx(styles.focusRing, ringContext.className)} style={ringContext.getStyle()} />;
}
