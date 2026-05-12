/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type {FC} from 'react';
import {ALL_FEATURE_FLAGS, type FeatureFlag, FeatureFlags} from '~/Constants';
import {SettingsTabContainer, SettingsTabHeader} from '~/components/modals/shared/SettingsTabLayout';
import {Button} from '~/components/uikit/Button/Button';
import FeatureFlagOverridesStore from '~/stores/FeatureFlagOverridesStore';
import FeatureFlagStore from '~/stores/FeatureFlagStore';
import styles from './FeatureFlagsTab.module.css';

type FeatureFlagMeta = {label: string; description: string};

const FeatureFlagsTab: FC = observer(() => {
	const {t} = useLingui();

	const featureFlagMetadata: Partial<Record<FeatureFlag, FeatureFlagMeta>> = {
		[FeatureFlags.MESSAGE_SCHEDULING]: {
			label: t`Message Scheduling`,
			description: t`Allow users to schedule messages for future delivery.`,
		},
		[FeatureFlags.EXPRESSION_PACKS]: {
			label: t`Expression Packs`,
			description: t`Allow users to create, install, and manage custom emoji and sticker packs.`,
		},
	};

	return (
		<SettingsTabContainer>
			<SettingsTabHeader
				title={t`Feature Flags`}
				description={t`Control whether unfinished features are visible during development.`}
			/>
			<p className={styles.intro}>
				<Trans>
					These toggles force the client to treat features as enabled or disabled without relying on the server
					configuration. They only affect your client experience and are shown to developers for testing.
				</Trans>
			</p>

			<div className={styles.flagList}>
				{ALL_FEATURE_FLAGS.map((flag) => renderFeatureFlag(flag, featureFlagMetadata))}
			</div>
		</SettingsTabContainer>
	);
});

const FeatureFlagCard: FC<{flag: FeatureFlag; meta: FeatureFlagMeta}> = observer(({flag, meta}) => {
	const {t} = useLingui();

	const guildCount = FeatureFlagStore.getGuildIdsForFlag(flag).length;
	const override = FeatureFlagOverridesStore.getOverride(flag);
	const statusLabel = override === null ? t`Following API configuration` : override ? t`Forced on` : t`Forced off`;

	return (
		<div className={styles.flagCard}>
			<div className={styles.flagHeader}>
				<div className={styles.textBlock}>
					<p className={styles.flagTitle}>{meta.label}</p>
					<p className={styles.flagDescription}>{meta.description}</p>
				</div>
				<div className={styles.statusBlock}>
					<span className={clsx(styles.statusLabel, styles[statusClassName(override)])}>{statusLabel}</span>
					<p className={styles.guildCount}>
						<Trans>Enabled for {guildCount} guild(s)</Trans>
					</p>
				</div>
			</div>

			<div className={styles.actions}>
				<Button
					variant={override === true ? 'primary' : 'secondary'}
					onClick={() => FeatureFlagOverridesStore.setOverride(flag, true)}
				>
					<Trans>Force on</Trans>
				</Button>
				<Button
					variant={override === false ? 'primary' : 'secondary'}
					onClick={() => FeatureFlagOverridesStore.setOverride(flag, false)}
				>
					<Trans>Force off</Trans>
				</Button>
				<Button variant="inverted-outline" onClick={() => FeatureFlagOverridesStore.setOverride(flag, null)}>
					<Trans>Use API config</Trans>
				</Button>
			</div>
		</div>
	);
});

const renderFeatureFlag = (flag: FeatureFlag, featureFlagMetadata: Partial<Record<FeatureFlag, FeatureFlagMeta>>) => {
	const meta = featureFlagMetadata[flag];
	if (!meta) return null;

	return <FeatureFlagCard key={flag} flag={flag} meta={meta} />;
};

const statusClassName = (override: boolean | null) => {
	if (override === true) return 'statusForcedOn';
	if (override === false) return 'statusForcedOff';
	return 'statusFollowing';
};

export default FeatureFlagsTab;
