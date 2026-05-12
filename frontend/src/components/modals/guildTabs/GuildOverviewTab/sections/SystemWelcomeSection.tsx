/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import React from 'react';
import type {UseFormReturn} from 'react-hook-form';
import {Controller} from 'react-hook-form';
import {Select as FormSelect} from '~/components/form/Select';
import {Switch} from '~/components/form/Switch';
import type {FormInputs, SelectOption} from '~/utils/modals/guildTabs/GuildOverviewTabUtils';

import {SettingsSection} from '../components/SettingsSection';
import styles from '../GuildOverviewTab.module.css';
import type {ChannelLike} from '../types';

export const SystemWelcomeSection: React.FC<{
	form: UseFormReturn<FormInputs>;
	canManageGuild: boolean;
	textChannels: Array<ChannelLike>;
}> = ({form, canManageGuild, textChannels}) => {
	const {t} = useLingui();
	const systemChannelOptions = React.useMemo<Array<SelectOption>>(
		() => [
			{value: null, label: t`No System Channel`},
			...textChannels.map((channel) => ({value: channel.id, label: channel.name ?? t`Unnamed channel`})),
		],
		[textChannels],
	);

	return (
		<SettingsSection
			title={<Trans>System &amp; Welcome</Trans>}
			description={<Trans>Choose destination for system and welcome messages</Trans>}
		>
			<div className={styles.settingsContent}>
				<div>
					<Controller
						name="system_channel_id"
						control={form.control}
						render={({field}) => (
							<FormSelect<string | null>
								label={t`Destination Channel`}
								description={t`Welcome and system messages will appear here.`}
								value={field.value ?? null}
								onChange={(v) => field.onChange(v)}
								options={systemChannelOptions}
								placeholder={t`Select a channel`}
								disabled={!canManageGuild}
							/>
						)}
					/>
				</div>

				<Controller
					name="suppress_join_notifications"
					control={form.control}
					render={({field}) => (
						<Switch
							label={t`Hide Join Messages`}
							description={t`When enabled, new member joins won't post to the destination channel.`}
							value={field.value ?? false}
							onChange={field.onChange}
							disabled={!canManageGuild}
						/>
					)}
				/>
			</div>
		</SettingsSection>
	);
};
