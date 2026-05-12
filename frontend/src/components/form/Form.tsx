/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type {FieldValues, UseFormReturn} from 'react-hook-form';

type FormProps<T extends FieldValues> = Omit<React.HTMLAttributes<HTMLFormElement>, 'onSubmit'> & {
	form: UseFormReturn<T>;
	onSubmit: (values: T) => void;
	'aria-label'?: string;
	'aria-labelledby'?: string;
};

export const Form = observer(
	<T extends FieldValues>({
		form,
		onSubmit,
		children,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		...props
	}: FormProps<T>) => (
		<form
			{...props}
			aria-label={ariaLabel || undefined}
			aria-labelledby={ariaLabelledBy || undefined}
			style={{display: 'contents', ...props.style}}
			onSubmit={(event) => {
				event.preventDefault();
				form.clearErrors();
				form.handleSubmit(onSubmit)(event);
			}}
		>
			{children}
		</form>
	),
);
