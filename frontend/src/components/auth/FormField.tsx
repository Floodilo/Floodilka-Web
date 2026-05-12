/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import {Input} from '~/components/form/Input';

interface FormFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
	name: string;
	label?: React.ReactNode;
	value: string;
	error?: string;
	placeholder?: string;
	onChange: (value: string) => void;
}

const FormField = observer(function FormField({name, label, value, error, onChange, ...props}: FormFieldProps) {
	return (
		<Input
			name={name}
			label={typeof label === 'string' ? label : undefined}
			value={value}
			error={error}
			onChange={(e) => onChange(e.target.value)}
			{...props}
		/>
	);
});

export default FormField;
