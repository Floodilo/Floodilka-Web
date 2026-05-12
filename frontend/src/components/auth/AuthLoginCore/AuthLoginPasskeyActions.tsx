/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {BrowserIcon, KeyIcon} from '@phosphor-icons/react';
import {Button} from '~/components/uikit/Button/Button';

export type AuthLoginDividerClasses = {
	divider: string;
	dividerLine: string;
	dividerText: string;
};

export function AuthLoginDivider({
	classes,
	label = <Trans>OR</Trans>,
}: {
	classes: AuthLoginDividerClasses;
	label?: React.ReactNode;
}) {
	return (
		<div className={classes.divider}>
			<div className={classes.dividerLine} />
			<span className={classes.dividerText}>{label}</span>
			<div className={classes.dividerLine} />
		</div>
	);
}

export type AuthPasskeyClasses = {
	wrapper?: string;
};

type Props = {
	classes?: AuthPasskeyClasses;

	disabled: boolean;

	onPasskeyLogin: () => void;
	showBrowserOption: boolean;
	onBrowserLogin?: () => void;

	primaryLabel?: React.ReactNode;
	browserLabel?: React.ReactNode;
};

export default function AuthLoginPasskeyActions({
	classes,
	disabled,
	onPasskeyLogin,
	showBrowserOption,
	onBrowserLogin,
	primaryLabel = <Trans>Log in with a passkey</Trans>,
	browserLabel = <Trans>Log in via browser</Trans>,
}: Props) {
	return (
		<div className={classes?.wrapper}>
			<Button
				type="button"
				fitContainer
				variant="secondary"
				onClick={onPasskeyLogin}
				disabled={disabled}
				leftIcon={<KeyIcon size={16} />}
			>
				{primaryLabel}
			</Button>

			{showBrowserOption && onBrowserLogin ? (
				<Button
					type="button"
					fitContainer
					variant="secondary"
					onClick={onBrowserLogin}
					disabled={disabled}
					leftIcon={<BrowserIcon size={16} />}
				>
					{browserLabel}
				</Button>
			) : null}
		</div>
	);
}
