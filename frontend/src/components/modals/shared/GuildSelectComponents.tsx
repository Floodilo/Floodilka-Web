/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {type OptionProps, components as reactSelectComponents, type SingleValueProps} from 'react-select';
import type {SelectOption} from '~/components/form/Select';
import * as AvatarUtils from '~/utils/AvatarUtils';

export interface GuildSelectOption extends SelectOption<string> {
	icon?: string | null;
}

export interface GuildSelectStyles {
	optionRow: string;
	valueRow?: string;
	rowGlobal?: string;
	rowDisabled?: string;
	avatar: string;
	avatarPlaceholder: string;
	label: string;
	notice?: string;
}

export interface GuildSelectComponentsConfig<T extends GuildSelectOption> {
	styles: GuildSelectStyles;
	getNotice?: (option: T, disabled: boolean) => React.ReactNode;
}

const renderRow = <T extends GuildSelectOption>(
	option: T,
	disabled: boolean,
	rowClass: string,
	styles: GuildSelectStyles,
	getNotice?: (option: T, disabled: boolean) => React.ReactNode,
) => {
	const isGlobal = !option.value;
	const iconUrl = option.icon ? AvatarUtils.getGuildIconURL({id: option.value, icon: option.icon}) : null;
	const initial = option.label.charAt(0).toUpperCase();
	const notice = getNotice?.(option, disabled);

	return (
		<div className={clsx(rowClass, isGlobal && styles.rowGlobal, disabled && styles.rowDisabled)}>
			{!isGlobal &&
				(iconUrl ? (
					<div className={styles.avatar} style={{backgroundImage: `url(${iconUrl})`}} aria-hidden />
				) : (
					<div className={styles.avatarPlaceholder} aria-hidden>
						{initial}
					</div>
				))}
			<span className={styles.label}>{option.label}</span>
			{notice ? styles.notice ? <span className={styles.notice}>{notice}</span> : notice : null}
		</div>
	);
};

export const createGuildSelectComponents = <T extends GuildSelectOption>({
	styles,
	getNotice,
}: GuildSelectComponentsConfig<T>) => {
	const Option = observer((props: OptionProps<T, false>) => (
		<reactSelectComponents.Option {...props}>
			{renderRow(props.data, Boolean(props.isDisabled), styles.optionRow, styles, getNotice)}
		</reactSelectComponents.Option>
	));

	const SingleValue = observer((props: SingleValueProps<T, false>) => (
		<reactSelectComponents.SingleValue {...props}>
			{renderRow(props.data, Boolean(props.isDisabled), styles.valueRow ?? styles.optionRow, styles, getNotice)}
		</reactSelectComponents.SingleValue>
	));

	return {Option, SingleValue};
};
