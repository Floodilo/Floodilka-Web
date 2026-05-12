/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {AppWindowIcon, CaretRightIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {StatusSlate} from '~/components/modals/shared/StatusSlate';
import styles from '~/components/modals/tabs/ApplicationsTab/ApplicationsTab.module.css';
import type {DeveloperApplication} from '~/records/DeveloperApplicationRecord';
import * as AvatarUtils from '~/utils/AvatarUtils';
import * as DateUtils from '~/utils/DateUtils';
import * as SnowflakeUtils from '~/utils/SnowflakeUtils';

interface ApplicationsListProps {
	applications: ReadonlyArray<DeveloperApplication>;
	onSelectApplication: (appId: string) => void;
}

export const ApplicationsList: React.FC<ApplicationsListProps> = observer(({applications, onSelectApplication}) => {
	if (applications.length === 0) {
		return (
			<div className={styles.emptyState}>
				<StatusSlate
					Icon={AppWindowIcon}
					title={<Trans>No applications yet</Trans>}
					description={<Trans>Create your first application to get started with the Флудилка API.</Trans>}
				/>
			</div>
		);
	}

	return (
		<div className={styles.listContainer}>
			{applications.map((app) => {
				const avatarUrl = app.bot
					? AvatarUtils.getUserAvatarURL({id: app.bot.id, avatar: app.bot.avatar}, false)
					: null;
				const createdAt = DateUtils.getFormattedShortDate(SnowflakeUtils.extractTimestamp(app.id));

				return (
					<div key={app.id} className={styles.itemContainer}>
						<button type="button" className={styles.itemButton} onClick={() => onSelectApplication(app.id)}>
							<div className={styles.itemLeft}>
								{avatarUrl ? (
									<div className={styles.itemAvatar} style={{backgroundImage: `url(${avatarUrl})`}} aria-hidden />
								) : (
									<div className={styles.itemAvatarPlaceholder} aria-hidden>
										{app.name.charAt(0).toUpperCase()}
									</div>
								)}
								<div className={styles.itemTextBlock}>
									<div className={styles.itemTitleRow}>
										<span className={styles.itemName}>{app.name}</span>
									</div>
									<div className={styles.itemMetaRow}>
										<span>
											<Trans>Created {createdAt}</Trans>
										</span>
									</div>
								</div>
							</div>
							<CaretRightIcon className={styles.itemChevron} weight="bold" />
						</button>
					</div>
				);
			})}
		</div>
	);
});
