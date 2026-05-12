/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import type React from 'react';
import type {UseFormReturn} from 'react-hook-form';
import {Controller} from 'react-hook-form';
import {Switch} from '~/components/form/Switch';
import type {FormInputs} from '~/utils/modals/guildTabs/GuildOverviewTabUtils';

import {SettingsSection} from '../components/SettingsSection';

export const TextChannelNamesSection: React.FC<{
	form: UseFormReturn<FormInputs>;
	canManageGuild: boolean;
}> = ({form, canManageGuild}) => {
	const {t} = useLingui();
	return (
		<SettingsSection
			title={<Trans>Text Channel Names</Trans>}
			description={<Trans>Configure how text channel names can be formatted</Trans>}
		>
			<Controller
				name="text_channel_flexible_names"
				control={form.control}
				render={({field}) => (
					<Switch
						label={t`Allow Flexible Text Channel Names`}
						description={t`When enabled, text channels can have capitalized letters and spaces in their names (like voice channels). When disabled, names are restricted to lowercase with hyphens and underscores only.`}
						value={field.value ?? false}
						onChange={field.onChange}
						disabled={!canManageGuild}
					/>
				)}
			/>
		</SettingsSection>
	);
};
