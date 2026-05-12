/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {InboxIcon} from '~/components/icons/InboxIcon';
import {InboxPopout} from '~/components/popouts/InboxPopout';
import {Popout} from '~/components/uikit/Popout/Popout';
import {usePopout} from '~/hooks/usePopout';
import {ChannelHeaderIcon} from './ChannelHeaderIcon';

export const InboxButton = observer(() => {
	const {t} = useLingui();
	const {isOpen, openProps} = usePopout('inbox');

	return (
		<Popout {...openProps} render={() => <InboxPopout />} position="bottom-end" subscribeTo="INBOX_OPEN">
			<ChannelHeaderIcon icon={InboxIcon} label={t`Inbox`} isSelected={isOpen} keybindAction="toggle_mentions_popout" />
		</Popout>
	);
});
