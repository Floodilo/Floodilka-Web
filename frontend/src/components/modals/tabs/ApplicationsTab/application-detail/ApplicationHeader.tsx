/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {ArrowLeftIcon, CheckIcon, CopyIcon} from '@phosphor-icons/react';
import type React from 'react';
import {Input} from '~/components/form/Input';
import {Button} from '~/components/uikit/Button/Button';
import styles from './ApplicationDetail.module.css';

interface ApplicationHeaderProps {
	name: string;
	applicationId: string;
	onBack: () => void;
	onCopyId: () => void;
	idCopied: boolean;
}

export const ApplicationHeader: React.FC<ApplicationHeaderProps> = ({
	name,
	applicationId,
	onBack,
	onCopyId,
	idCopied,
}) => {
	const {t} = useLingui();
	return (
		<div className={styles.pageHeader}>
			<div className={styles.breadcrumbRow}>
				<Button variant="secondary" onClick={onBack} leftIcon={<ArrowLeftIcon size={16} weight="bold" />} fitContent>
					{t`Back to Applications`}
				</Button>
			</div>

			<div className={styles.heroCard}>
				<div className={styles.heroTop}>
					<div>
						<h2 className={styles.heroTitle}>{name}</h2>
						<Input
							label={t`Application ID`}
							value={applicationId}
							readOnly
							className={styles.metaInput}
							rightElement={
								<Button
									variant="secondary"
									compact
									fitContent
									onClick={onCopyId}
									leftIcon={idCopied ? <CheckIcon size={14} weight="bold" /> : <CopyIcon size={14} />}
								>
									{idCopied ? t`Copied` : t`Copy ID`}
								</Button>
							}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};
