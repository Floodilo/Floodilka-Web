/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {ConfirmModal} from '~/components/modals/ConfirmModal';

export const MessageDeleteTooQuickModal = observer(() => {
	const {t} = useLingui();

	return (
		<ConfirmModal
			title={t`You're deleting messages too quickly`}
			description={t`The problem with being faster than light is that you can only live in darkness. Take a breather and try again.`}
			primaryText={t`Gotcha`}
			onPrimary={() => {}}
		/>
	);
});
