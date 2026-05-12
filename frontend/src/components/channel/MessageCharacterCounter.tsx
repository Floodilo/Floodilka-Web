/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import * as PremiumModalActionCreators from '~/actions/PremiumModalActionCreators';
import {MAX_MESSAGE_LENGTH_PREMIUM} from '~/Constants';
import styles from '~/components/channel/MessageCharacterCounter.module.css';
import {CharacterCounter} from '~/components/uikit/CharacterCounter/CharacterCounter';

interface MessageCharacterCounterProps {
	currentLength: number;
	maxLength: number;
	isPremium: boolean;
	threshold?: number;
}

export const MessageCharacterCounter = observer(
	({currentLength, maxLength, isPremium, threshold = 0.8}: MessageCharacterCounterProps) => {
		if (currentLength <= maxLength * threshold) {
			return null;
		}

		return (
			<div className={styles.container}>
				<CharacterCounter
					currentLength={currentLength}
					maxLength={maxLength}
					isPremium={isPremium}
					premiumMaxLength={MAX_MESSAGE_LENGTH_PREMIUM}
					onUpgradeClick={() => PremiumModalActionCreators.open()}
				/>
			</div>
		);
	},
);
