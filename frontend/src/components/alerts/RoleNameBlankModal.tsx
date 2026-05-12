/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {ConfirmModal} from '~/components/modals/ConfirmModal';

export const RoleNameBlankModal = observer(() => {
	const {t} = useLingui();
	return (
		<ConfirmModal
			title={t`Role name cannot be blank`}
			description={t`You cannot save a role with a blank name. Please provide a valid name before saving.`}
			primaryText={t`Understood`}
			onPrimary={() => {}}
		/>
	);
});
