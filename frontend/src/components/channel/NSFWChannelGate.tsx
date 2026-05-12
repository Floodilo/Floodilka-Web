/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {WarningIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import * as GuildNSFWActionCreators from '~/actions/GuildNSFWActionCreators';
import {Button} from '~/components/uikit/Button/Button';
import {NSFWGateReason} from '~/stores/GuildNSFWAgreeStore';
import styles from './NSFWChannelGate.module.css';

interface Props {
	channelId: string;
	reason: NSFWGateReason;
}

export const NSFWChannelGate = observer(({channelId, reason}: Props) => {
	const handleAgree = () => {
		GuildNSFWActionCreators.agreeToNSFWChannel(channelId);
	};

	const renderContent = () => {
		switch (reason) {
			case NSFWGateReason.AGE_RESTRICTED:
				return (
					<>
						<h2 className={styles.title}>
							<Trans>Age-Restricted Channel</Trans>
						</h2>
						<p className={styles.description}>
							<Trans>You must be 18 or older to view this channel.</Trans>
						</p>
					</>
				);
			default:
				return (
					<>
						<h2 className={styles.title}>
							<Trans>NSFW Channel</Trans>
						</h2>
						<p className={styles.description}>
							<Trans>
								This channel may contain content that is not safe for work or that may be inappropriate for some users.
								You must be 18 or older to view this channel.
							</Trans>
						</p>
						<Button onClick={handleAgree} variant="danger-primary">
							<Trans>I am 18 or older</Trans>
						</Button>
					</>
				);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.iconContainer}>
					<WarningIcon className={styles.icon} weight="fill" />
				</div>
				{renderContent()}
			</div>
		</div>
	);
});
