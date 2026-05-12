/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import MemberListStore from '~/stores/MemberListStore';

const MIN_WIDTH_FOR_MEMBERS = 1024;

export const useMemberListVisible = (): boolean => {
	const {isMembersOpen} = MemberListStore;
	const [canFit, setCanFit] = React.useState(() => window.innerWidth >= MIN_WIDTH_FOR_MEMBERS);

	React.useEffect(() => {
		const checkWidth = () => {
			setCanFit(window.innerWidth >= MIN_WIDTH_FOR_MEMBERS);
		};

		window.addEventListener('resize', checkWidth);
		return () => window.removeEventListener('resize', checkWidth);
	}, []);

	return isMembersOpen && canFit;
};

export const useCanFitMemberList = (): boolean => {
	const [canFit, setCanFit] = React.useState(() => window.innerWidth >= MIN_WIDTH_FOR_MEMBERS);

	React.useEffect(() => {
		const checkWidth = () => {
			setCanFit(window.innerWidth >= MIN_WIDTH_FOR_MEMBERS);
		};

		window.addEventListener('resize', checkWidth);
		return () => window.removeEventListener('resize', checkWidth);
	}, []);

	return canFit;
};
