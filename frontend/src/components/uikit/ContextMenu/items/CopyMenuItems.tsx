/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as TextCopyActionCreators from '~/actions/TextCopyActionCreators';
import type {UserRecord} from '~/records/UserRecord';
import {CopyUserIdIcon} from '../ContextMenuIcons';
import {MenuItem} from '../MenuItem';

interface CopyUserIdMenuItemProps {
	user: UserRecord;
	onClose: () => void;
}

export const CopyUserIdMenuItem: React.FC<CopyUserIdMenuItemProps> = observer(({user, onClose}) => {
	const {t, i18n} = useLingui();
	const handleCopyUserId = React.useCallback(() => {
		onClose();
		TextCopyActionCreators.copy(i18n, user.id, true);
	}, [user.id, onClose, i18n]);

	return (
		<MenuItem icon={<CopyUserIdIcon />} onClick={handleCopyUserId}>
			{t`Copy User ID`}
		</MenuItem>
	);
});
