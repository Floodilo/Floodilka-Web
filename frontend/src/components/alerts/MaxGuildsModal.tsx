/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Plural, Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {ConfirmModal} from '~/components/modals/ConfirmModal';
import UserStore from '~/stores/UserStore';

export const MaxGuildsModal = observer(() => {
	const {t} = useLingui();
	const currentUser = UserStore.currentUser!;
	const maxGuilds = currentUser.maxGuilds;

	return (
		<ConfirmModal
			title={t`Too Many Communities`}
			description={
				<Trans>
					You've reached the maximum number of communities you can join (
					<Plural value={maxGuilds} one="# community" other="# communities" />
					). Please leave a community before joining another one.
				</Trans>
			}
			primaryText={t`Understood`}
			onPrimary={() => {}}
		/>
	);
});
