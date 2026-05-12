/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {MAX_ATTACHMENTS_PER_MESSAGE} from '~/Constants';
import {ConfirmModal} from '~/components/modals/ConfirmModal';

export const TooManyAttachmentsModal = observer(() => {
	const {t} = useLingui();
	return (
		<ConfirmModal
			title={t`Whoa, this is heavy`}
			description={t`You can only upload ${MAX_ATTACHMENTS_PER_MESSAGE} files at a time. Try again with fewer files.`}
			primaryText={t`Understood`}
			onPrimary={() => {}}
		/>
	);
});
