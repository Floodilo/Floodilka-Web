/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Plural, Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import styles from '~/components/modals/EmojiUploadModal.module.css';
import * as Modal from '~/components/modals/Modal';
import {Spinner} from '~/components/uikit/Spinner';

interface EmojiUploadModalProps {
	count: number;
}

export const EmojiUploadModal: React.FC<EmojiUploadModalProps> = observer(({count}) => {
	return (
		<Modal.Root size="small" centered>
			<Modal.Header title={<Trans>Uploading Emojis</Trans>} hideCloseButton />
			<Modal.Content>
				<div className={styles.container}>
					<Spinner />
					<p className={styles.message}>
						<Trans>
							Uploading <Plural value={count} one="# emoji" other="# emojis" />. This may take a little while.
						</Trans>
					</p>
				</div>
			</Modal.Content>
		</Modal.Root>
	);
});
