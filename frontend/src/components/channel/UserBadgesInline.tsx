/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {UserFlags, UserPremiumTypes} from '~/Constants';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import type {UserRecord} from '~/records/UserRecord';
import UserProfileStore from '~/stores/UserProfileStore';
import styles from './UserBadgesInline.module.css';

interface UserBadgesInlineProps {
	user: UserRecord;
	guildId?: string;
}

interface InlineBadge {
	key: string;
	iconUrl: string;
	tooltip: string;
}

export const UserBadgesInline: React.FC<UserBadgesInlineProps> = observer(({user, guildId}) => {
	const {t} = useLingui();

	const profile = UserProfileStore.getProfile(user.id, guildId);
	const premiumType = user.premiumType ?? profile?.premiumType ?? null;

	const badges: Array<InlineBadge> = [];

	if (user.flags & UserFlags.STAFF) {
		badges.push({key: 'staff', iconUrl: '/badges/staff.svg', tooltip: t`Floodilka Staff`});
	}

	if (user.flags & UserFlags.CTP_MEMBER) {
		badges.push({key: 'ctp', iconUrl: '/badges/ctp.svg', tooltip: t`Floodilka Community Team`});
	}

	if (user.flags & UserFlags.PARTNER) {
		badges.push({key: 'partner', iconUrl: '/badges/partner.svg', tooltip: t`Floodilka Partner`});
	}

	if (user.flags & UserFlags.BUG_HUNTER) {
		badges.push({key: 'bug_hunter', iconUrl: '/badges/bug-hunter.svg', tooltip: t`Floodilka Bug Hunter`});
	}

	if (premiumType != null && premiumType !== UserPremiumTypes.NONE) {
		badges.push({key: 'premium', iconUrl: '/badges/premium.svg', tooltip: t`Floodilka Premium Subscriber`});
	}

	if (badges.length === 0) {
		return null;
	}

	return (
		<span className={styles.container}>
			{badges.map((badge) => (
				<Tooltip key={badge.key} text={badge.tooltip}>
					<img src={badge.iconUrl} alt={badge.tooltip} className={styles.badge} />
				</Tooltip>
			))}
		</span>
	);
});
