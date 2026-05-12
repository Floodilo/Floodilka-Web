/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {ConfirmModal} from '~/components/modals/ConfirmModal';

export const TooManyReactionsModal = observer(() => {
	const {t} = useLingui();

	return (
		<ConfirmModal
			title={t`Whoa, this is heavy`}
			description={t`This is one heavy message. Some reactions need to be removed before you can add more.`}
			primaryText={t`Understood`}
			onPrimary={() => {}}
		/>
	);
});
