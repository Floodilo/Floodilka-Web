/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {FlagIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import type {IARContext} from '~/components/modals/IARModal';
import {IARModal} from '~/components/modals/IARModal';
import type {MessageRecord} from '~/records/MessageRecord';
import {MenuItem} from '../MenuItem';

interface ReportMessageMenuItemProps {
	message: MessageRecord;
	onClose: () => void;
}

export const ReportMessageMenuItem: React.FC<ReportMessageMenuItemProps> = observer(({message, onClose}) => {
	const {t} = useLingui();
	const handleReportMessage = React.useCallback(() => {
		onClose();
		const context: IARContext = {
			type: 'message',
			message,
		};
		ModalActionCreators.push(modal(() => <IARModal context={context} />));
	}, [message, onClose]);

	if (message.isCurrentUserAuthor()) {
		return null;
	}

	return (
		<MenuItem icon={<FlagIcon size={16} />} onClick={handleReportMessage} danger>
			{t`Report Message`}
		</MenuItem>
	);
});
