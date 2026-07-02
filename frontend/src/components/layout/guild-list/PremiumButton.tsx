/*
 * Copyright (C) 2026 Floodilka Contributors
 *
 * This file is part of Floodilka.
 *
 * Floodilka is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Floodilka is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Floodilka. If not, see <https://www.gnu.org/licenses/>.
 */

import {useLingui} from '@lingui/react/macro';
import {Microphone, Sparkle} from '@phosphor-icons/react';
import {motion} from 'framer-motion';
import {observer} from 'mobx-react-lite';
import React from 'react';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import {Routes} from '~/Routes';
import RuntimeConfigStore from '~/stores/RuntimeConfigStore';
import * as RouterUtils from '~/utils/RouterUtils';
import {useHover} from '~/hooks/useHover';
import {useMergeRefs} from '~/hooks/useMergeRefs';
import guildStyles from '../GuildsLayout.module.css';
import styles from './PremiumButton.module.css';

export const PremiumButton = observer(() => {
	const {t} = useLingui();
	const [hoverRef] = useHover();
	const buttonRef = React.useRef<HTMLButtonElement | null>(null);
	const iconRef = React.useRef<HTMLDivElement | null>(null);
	const mergedButtonRef = useMergeRefs([hoverRef, buttonRef]);

	return (
		<div className={guildStyles.addGuildButton}>
			<Tooltip position="right" size="large" text={() => t`Floodilka Premium`}>
				<FocusRing offset={-2} focusTarget={buttonRef} ringTarget={iconRef}>
					<button
						type="button"
						aria-label={t`Floodilka Premium`}
						onClick={() => {
							if (RuntimeConfigStore.isSelfHosted()) return;
							RouterUtils.transitionTo(Routes.ME_PREMIUM);
						}}
						className={styles.button}
						ref={mergedButtonRef}
					>
						<motion.div
							ref={iconRef}
							className={guildStyles.addGuildButtonIcon}
							animate={{borderRadius: '30%'}}
							initial={{borderRadius: '30%'}}
							transition={{duration: 0.07, ease: 'easeOut'}}
						>
							<span className={styles.premiumIcon} aria-hidden>
								<Microphone weight="fill" className={styles.premiumMic} />
								<Sparkle weight="fill" className={styles.premiumSparkle} />
							</span>
						</motion.div>
					</button>
				</FocusRing>
			</Tooltip>
		</div>
	);
});
