/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import floodilkaLogo from '~/images/floodilka-logo-color.png';

export const FloodilkaIcon = observer((props: React.ImgHTMLAttributes<HTMLImageElement>) => {
	const {t} = useLingui();

	return (
		<img
			src={floodilkaLogo}
			alt={t`Floodilka application icon`}
			{...props}
		/>
	);
});
