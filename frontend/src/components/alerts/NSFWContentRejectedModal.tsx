/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {ConfirmModal} from '~/components/modals/ConfirmModal';

export const NSFWContentRejectedModal = observer(() => {
	const {t} = useLingui();

	return (
		<ConfirmModal
			title={t`NSFW content not allowed`}
			description={t`This channel is not marked as NSFW. Explicit content can only be sent in NSFW channels. Ask a moderator to mark this channel as NSFW if appropriate.`}
			primaryText={t`Understood`}
			onPrimary={() => {}}
		/>
	);
});
