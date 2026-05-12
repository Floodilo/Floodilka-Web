/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {useId, useMemo, useState} from 'react';
import * as AuthenticationActionCreators from '~/actions/AuthenticationActionCreators';
import {DateOfBirthField} from '~/components/auth/DateOfBirthField';
import FormField from '~/components/auth/FormField';
import {type MissingField, SubmitTooltip, shouldDisableSubmit} from '~/components/auth/SubmitTooltip';
import {ExternalLink} from '~/components/common/ExternalLink';
import {Button} from '~/components/uikit/Button/Button';
import {Checkbox} from '~/components/uikit/Checkbox/Checkbox';
import {useAuthForm} from '~/hooks/useAuthForm';
import {Routes} from '~/Routes';
import styles from './AuthPageStyles.module.css';

interface AuthMinimalRegisterFormCoreProps {
	submitLabel: React.ReactNode;
	redirectPath: string;
	onRegister?: (response: {ticket: string}) => Promise<void>;
	inviteCode?: string;
	extraContent?: React.ReactNode;
}

export function AuthMinimalRegisterFormCore({
	submitLabel,
	redirectPath,
	onRegister,
	inviteCode,
	extraContent,
}: AuthMinimalRegisterFormCoreProps) {
	const {t} = useLingui();
	const globalNameId = useId();

	const [selectedMonth, setSelectedMonth] = useState('');
	const [selectedDay, setSelectedDay] = useState('');
	const [selectedYear, setSelectedYear] = useState('');
	const [consent, setConsent] = useState(false);

	const initialValues: Record<string, string> = {
		global_name: '',
	};

	const handleRegisterSubmit = async (values: Record<string, string>) => {
		const dateOfBirth =
			selectedYear && selectedMonth && selectedDay
				? `${selectedYear}-${selectedMonth.padStart(2, '0')}-${selectedDay.padStart(2, '0')}`
				: '';

		const response = await AuthenticationActionCreators.register({
			global_name: values.global_name || undefined,
			date_of_birth: dateOfBirth,
			consent,
			invite_code: inviteCode,
		});

		if (onRegister) {
			await onRegister(response);
		}
	};

	const {form, isLoading, fieldErrors} = useAuthForm({
		initialValues,
		onSubmit: handleRegisterSubmit,
		redirectPath,
		firstFieldName: 'global_name',
	});
	const missingFields = useMemo(() => {
		const missing: Array<MissingField> = [];
		if (!selectedMonth || !selectedDay || !selectedYear) {
			missing.push({key: 'date_of_birth', label: t`Date of birth`});
		}
		return missing;
	}, [selectedMonth, selectedDay, selectedYear]);

	const globalNameValue = form.getValue('global_name');

	return (
		<form className={styles.form} onSubmit={form.handleSubmit}>
			<FormField
				id={globalNameId}
				name="global_name"
				type="text"
				label={t`Display name (optional)`}
				placeholder={t`What should people call you?`}
				value={globalNameValue}
				onChange={(value) => form.setValue('global_name', value)}
				error={form.getError('global_name') || fieldErrors?.global_name}
			/>

			<DateOfBirthField
				selectedMonth={selectedMonth}
				selectedDay={selectedDay}
				selectedYear={selectedYear}
				onMonthChange={setSelectedMonth}
				onDayChange={setSelectedDay}
				onYearChange={setSelectedYear}
				error={!!fieldErrors?.date_of_birth}
			/>

			{extraContent}

			<div className={styles.consentRow}>
				<Checkbox checked={consent} onChange={setConsent}>
					<span className={styles.consentLabel}>
						<Trans>I agree to the</Trans>{' '}
						<ExternalLink href={Routes.terms()} className={styles.policyLink}>
							<Trans>Terms of Service</Trans>
						</ExternalLink>{' '}
						<Trans>and</Trans>{' '}
						<ExternalLink href={Routes.privacy()} className={styles.policyLink}>
							<Trans>Privacy Policy</Trans>
						</ExternalLink>
					</span>
				</Checkbox>
			</div>

			<SubmitTooltip consent={consent} missingFields={missingFields}>
				<Button
					type="submit"
					fitContainer
					disabled={isLoading || form.isSubmitting || shouldDisableSubmit(consent, missingFields)}
				>
					{submitLabel}
				</Button>
			</SubmitTooltip>
		</form>
	);
}
