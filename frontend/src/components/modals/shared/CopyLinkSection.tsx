/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {CheckIcon, CopyIcon} from '@phosphor-icons/react';
import type {ComponentProps, MouseEvent, ReactNode} from 'react';
import {Input} from '~/components/form/Input';
import {Button} from '~/components/uikit/Button/Button';
import styles from './CopyLinkSection.module.css';

interface CopyLinkSectionProps {
	label: ReactNode;
	value: string;
	placeholder?: string;
	onCopy?: () => void;
	copied?: boolean;
	copyDisabled?: boolean;
	onInputClick?: (event: MouseEvent<HTMLInputElement>) => void;
	rightElement?: ReactNode;
	inputProps?: Partial<ComponentProps<typeof Input>>;
	children?: ReactNode;
}

export const CopyLinkSection = ({
	label,
	value,
	placeholder,
	onCopy,
	copied,
	copyDisabled,
	onInputClick,
	rightElement,
	inputProps,
	children,
}: CopyLinkSectionProps) => {
	const {t} = useLingui();
	const defaultRightElement = onCopy && (
		<Button
			compact
			fitContent
			onClick={onCopy}
			disabled={!value || copyDisabled}
			leftIcon={copied ? <CheckIcon size={16} weight="bold" /> : <CopyIcon size={16} />}
		>
			{copied ? t`Copied` : t`Copy`}
		</Button>
	);

	return (
		<div className={styles.linkFooter}>
			<p className={styles.linkSectionLabel}>{label}</p>
			<Input
				readOnly
				value={value}
				placeholder={placeholder}
				onClick={onInputClick}
				rightElement={rightElement ?? defaultRightElement}
				{...inputProps}
			/>
			{children}
		</div>
	);
};
