/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import * as Modal from '~/components/modals/Modal';
import {type PremiumModalProps, usePremiumModalLogic} from '~/utils/modals/PremiumModalUtils';
import {PremiumContent} from './components/PremiumContent';
import styles from './PremiumModal.module.css';

export const PremiumModal = observer(({defaultGiftMode = false}: PremiumModalProps) => {
	const modalLogic = usePremiumModalLogic({
		defaultGiftMode,
	});

	return (
		<Modal.Root size="large">
			<Modal.Header title={<Trans>Floodilka Premium</Trans>} />
			<Modal.Content>
				<div className={styles.contentContainer}>
					<PremiumContent defaultGiftMode={modalLogic.defaultGiftMode} />
				</div>
			</Modal.Content>
		</Modal.Root>
	);
});
