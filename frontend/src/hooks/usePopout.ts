/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {reaction} from 'mobx';
import React from 'react';
import PopoutStore from '~/stores/PopoutStore';

export const usePopout = (uniqueId: string | number) => {
	const [isOpen, setIsOpen] = React.useState(() => uniqueId in PopoutStore.popouts);

	React.useEffect(() => {
		const dispose = reaction(
			() => uniqueId in PopoutStore.popouts,
			(open) => {
				setIsOpen(open);
			},
			{fireImmediately: true},
		);

		return dispose;
	}, [uniqueId]);

	const openProps = React.useMemo(
		() => ({
			uniqueId,
		}),
		[uniqueId],
	);

	return {
		isOpen,
		openProps,
	};
};
