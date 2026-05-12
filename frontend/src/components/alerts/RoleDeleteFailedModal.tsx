/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {GenericErrorModal} from './GenericErrorModal';

export const RoleDeleteFailedModal: React.FC<{roleName?: string}> = observer(({roleName}) => {
	const {t} = useLingui();

	return (
		<GenericErrorModal
			title={t`Failed to delete role`}
			message={
				<Trans>
					The role <strong>"{roleName}"</strong> could not be deleted at this time. Please try again.
				</Trans>
			}
		/>
	);
});
