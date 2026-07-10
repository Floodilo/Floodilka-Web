/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';
import MobileLayoutStore from '~/stores/MobileLayoutStore';
import styles from './NagbarContainer.module.css';
import {DesktopDownloadNagbar} from './nagbars/DesktopDownloadNagbar';
import {DesktopNotificationNagbar} from './nagbars/DesktopNotificationNagbar';
import {EmailVerificationNagbar} from './nagbars/EmailVerificationNagbar';
import {GiftInventoryNagbar} from './nagbars/GiftInventoryNagbar';
import {GuildMembershipCtaNagbar} from './nagbars/GuildMembershipCtaNagbar';
import {PendingBulkDeletionNagbar} from './nagbars/PendingBulkDeletionNagbar';
import {PremiumExpiredNagbar} from './nagbars/PremiumExpiredNagbar';
import {PremiumGracePeriodNagbar} from './nagbars/PremiumGracePeriodNagbar';
import {PremiumOnboardingNagbar} from './nagbars/PremiumOnboardingNagbar';
import {TotpNudgeNagbar} from './nagbars/TotpNudgeNagbar';
import {UnclaimedAccountNagbar} from './nagbars/UnclaimedAccountNagbar';
import {type NagbarState, NagbarType} from './types';

interface NagbarContainerProps {
	nagbars: Array<NagbarState>;
}

export const NagbarContainer: React.FC<NagbarContainerProps> = observer(({nagbars}) => {
	const mobileLayout = MobileLayoutStore;

	if (nagbars.length === 0) return null;

	return (
		<div className={styles.container}>
			{nagbars.map((nagbar) => {
				switch (nagbar.type) {
					case NagbarType.UNCLAIMED_ACCOUNT:
						return <UnclaimedAccountNagbar key={nagbar.type} isMobile={mobileLayout.enabled} />;
					case NagbarType.EMAIL_VERIFICATION:
						return <EmailVerificationNagbar key={nagbar.type} isMobile={mobileLayout.enabled} />;
					case NagbarType.BULK_DELETE_PENDING:
						return <PendingBulkDeletionNagbar key={nagbar.type} isMobile={mobileLayout.enabled} />;
					case NagbarType.DESKTOP_NOTIFICATION:
						return <DesktopNotificationNagbar key={nagbar.type} isMobile={mobileLayout.enabled} />;
					case NagbarType.PREMIUM_GRACE_PERIOD:
						return <PremiumGracePeriodNagbar key={nagbar.type} isMobile={mobileLayout.enabled} />;
					case NagbarType.PREMIUM_EXPIRED:
						return <PremiumExpiredNagbar key={nagbar.type} isMobile={mobileLayout.enabled} />;
					case NagbarType.PREMIUM_ONBOARDING:
						return <PremiumOnboardingNagbar key={nagbar.type} isMobile={mobileLayout.enabled} />;
					case NagbarType.GIFT_INVENTORY:
						return <GiftInventoryNagbar key={nagbar.type} isMobile={mobileLayout.enabled} />;
					case NagbarType.DESKTOP_DOWNLOAD:
						return <DesktopDownloadNagbar key={nagbar.type} isMobile={mobileLayout.enabled} />;
					case NagbarType.GUILD_MEMBERSHIP_CTA:
						return <GuildMembershipCtaNagbar key={nagbar.type} isMobile={mobileLayout.enabled} />;
					case NagbarType.TOTP_NUDGE:
						return <TotpNudgeNagbar key={nagbar.type} isMobile={mobileLayout.enabled} />;
					default:
						return null;
				}
			})}
		</div>
	);
});
