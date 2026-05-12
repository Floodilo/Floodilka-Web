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

export const DisallowUnclaimedAccountsSection: React.FC<{
	form: UseFormReturn<FormInputs>;
	canManageGuild: boolean;
}> = ({form, canManageGuild}) => {
	const {t} = useLingui();
	return (
		<SettingsSection
			title={<Trans>Unclaimed Account Access</Trans>}
			description={<Trans>Control whether unclaimed accounts can access this community</Trans>}
		>
			<Controller
				name="disallow_unclaimed_accounts"
				control={form.control}
				render={({field}) => (
					<Switch
						label={t`Disallow Unclaimed Accounts`}
						description={t`When enabled, unclaimed accounts will not be able to access or interact with this community.`}
						value={field.value ?? false}
						onChange={field.onChange}
						disabled={!canManageGuild}
					/>
				)}
			/>
		</SettingsSection>
	);
};
