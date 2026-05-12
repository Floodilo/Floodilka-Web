/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import React from 'react';
import * as QuickSwitcherActionCreators from '~/actions/QuickSwitcherActionCreators';
import {QuickSwitcherBottomSheet} from '~/components/bottomsheets/QuickSwitcherBottomSheet';
import {Modals} from '~/components/modals/Modals';
import {ContextMenu} from '~/components/uikit/ContextMenu/ContextMenu';
import {Popouts} from '~/components/uikit/Popout/Popouts';
import {Toasts} from '~/components/uikit/Toast/Toasts';
import {PiPOverlay} from '~/components/voice/PiPOverlay';
import LayerManager from '~/stores/LayerManager';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import QuickSwitcherStore from '~/stores/QuickSwitcherStore';
import {handleContextMenu} from '~/utils/ContextMenuUtils';

const GlobalOverlays: React.FC = observer(() => {
	const isMobile = MobileLayoutStore.isMobileLayout();
	const quickSwitcherOpen = QuickSwitcherStore.isOpen;

	React.useEffect(() => {
		LayerManager.init();

		document.addEventListener('contextmenu', handleContextMenu, false);
		return () => {
			document.removeEventListener('contextmenu', handleContextMenu, false);
		};
	}, []);

	return (
		<>
			<Modals />
			<Popouts />
			<ContextMenu />
			<Toasts />
			<PiPOverlay />
			{isMobile && <QuickSwitcherBottomSheet isOpen={quickSwitcherOpen} onClose={QuickSwitcherActionCreators.hide} />}
		</>
	);
});

export default GlobalOverlays;
