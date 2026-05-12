/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {ConfirmModal} from '~/components/modals/ConfirmModal';

interface GenericErrorModalProps {
	title: string;
	message: React.ReactNode;
}

export const GenericErrorModal: React.FC<GenericErrorModalProps> = observer(({title, message}) => {
	const {t} = useLingui();
	return <ConfirmModal title={title} description={message} primaryText={t`Understood`} onPrimary={() => {}} />;
});
