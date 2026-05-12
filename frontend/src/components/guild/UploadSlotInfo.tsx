/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {UploadIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {Button} from '~/components/uikit/Button/Button';
import styles from './UploadSlotInfo.module.css';

interface UploadSlotInfoProps {
	title: React.ReactNode;
	currentCount: number;
	maxCount: number;
	description: React.ReactNode;
	uploadButtonText: React.ReactNode;
	onUploadClick: () => void;
	additionalSlots?: React.ReactNode;
}

export const UploadSlotInfo: React.FC<UploadSlotInfoProps> = observer(
	({title, currentCount, maxCount, description, uploadButtonText, onUploadClick, additionalSlots}) => {
		return (
			<div className={styles.container}>
				<div className={styles.header}>
					<div>
						<h3 className={styles.title}>{title}</h3>
						<div className={styles.stats}>
							{additionalSlots || (
								<span>
									<Trans>
										{currentCount} / {maxCount === Number.POSITIVE_INFINITY ? '∞' : maxCount}
									</Trans>
								</span>
							)}
						</div>
					</div>
					<div className={styles.uploadButtonDesktop}>
						<Button onClick={onUploadClick} leftIcon={<UploadIcon className={styles.icon} />}>
							{uploadButtonText}
						</Button>
					</div>
				</div>
				<p className={styles.description}>{description}</p>
				<div className={styles.uploadButtonMobile}>
					<Button onClick={onUploadClick} leftIcon={<UploadIcon className={styles.icon} />}>
						{uploadButtonText}
					</Button>
				</div>
			</div>
		);
	},
);
