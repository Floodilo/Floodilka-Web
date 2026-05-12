/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {XIcon} from '@phosphor-icons/react';
import type React from 'react';
import {Input} from '~/components/form/Input';
import {Switch} from '~/components/form/Switch';
import {Button} from '~/components/uikit/Button/Button';
import styles from './ApplicationDetail.module.css';
import {SectionCard} from './SectionCard';
import type {ApplicationDetailForm} from './types';

interface ApplicationInfoSectionProps {
	form: ApplicationDetailForm;
	redirectInputs: Array<string>;
	onAddRedirect: () => void;
	onRemoveRedirect: (index: number) => void;
	onUpdateRedirect: (index: number, value: string) => void;
}

export const ApplicationInfoSection: React.FC<ApplicationInfoSectionProps> = ({
	form,
	redirectInputs,
	onAddRedirect,
	onRemoveRedirect,
	onUpdateRedirect,
}) => {
	const {t} = useLingui();
	const redirectList = redirectInputs ?? [];

	return (
		<SectionCard title={t`Application information`} subtitle={t`Basic settings and allowed redirect URIs.`}>
			<div className={styles.fieldStack}>
				<Input
					{...form.register('name', {required: t`Application name is required`})}
					label={t`Application Name`}
					value={form.watch('name')}
					placeholder={t`My Application`}
					maxLength={100}
					error={form.formState.errors.name?.message}
				/>

				<div className={styles.toggleRow}>
					<Switch
						label={t`Public bot`}
						description={t`Allow anyone to invite this bot to their communities.`}
						value={form.watch('botPublic')}
						onChange={(checked) => form.setValue('botPublic', checked, {shouldDirty: true})}
						className={styles.toggleSwitch}
					/>
				</div>

				<div className={styles.toggleRow}>
					<Switch
						label={t`Require OAuth2 code grant`}
						description={t`Require completion of the full OAuth2 code grant flow when adding this bot to a community.`}
						value={form.watch('botRequireCodeGrant')}
						onChange={(checked) => form.setValue('botRequireCodeGrant', checked, {shouldDirty: true})}
						className={styles.toggleSwitch}
					/>
				</div>

				<div className={styles.redirectList}>
					{redirectList.map((value, idx) => (
						<div key={idx} className={styles.redirectRow} data-first={idx === 0 ? 'true' : undefined}>
							<Input
								label={idx === 0 ? t`Redirect URIs` : undefined}
								value={value}
								onChange={(e) => onUpdateRedirect(idx, e.target.value)}
								placeholder={t`https://example.com/callback`}
							/>
							<div className={styles.redirectActions}>
								<button
									type="button"
									className={styles.redirectRemoveButton}
									onClick={() => onRemoveRedirect(idx)}
									disabled={idx === 0}
									aria-label={t`Remove redirect URI`}
								>
									<XIcon size={18} weight="bold" />
								</button>
							</div>
						</div>
					))}
					<Button variant="primary" fitContent className={styles.addRedirectButton} onClick={onAddRedirect}>
						{t`Add redirect`}
					</Button>
				</div>
			</div>
		</SectionCard>
	);
};
