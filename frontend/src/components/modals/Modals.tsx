/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {AnimatePresence} from 'framer-motion';
import {observer} from 'mobx-react-lite';
import {MediaViewerModal} from '~/components/modals/MediaViewerModal';
import styles from '~/components/modals/Modals.module.css';
import {UserProfileMobileSheet} from '~/components/modals/UserProfileMobileSheet';
import ModalStore from '~/stores/ModalStore';
import {ModalStackContext} from '~/utils/modals/ModalUtils';

export const Modals = observer(() => {
	const orderedModals = ModalStore.orderedModals;

	return (
		<div className={styles.modals} data-overlay-pass-through="true">
			<MediaViewerModal />
			<UserProfileMobileSheet />

			<AnimatePresence>
				{orderedModals.map(({key, modal, stackIndex, isVisible, needsBackdrop}) => (
					<ModalStackContext.Provider key={key} value={{stackIndex, isVisible, needsBackdrop}}>
						{modal()}
					</ModalStackContext.Provider>
				))}
			</AnimatePresence>
		</div>
	);
});
