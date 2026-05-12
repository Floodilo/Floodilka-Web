/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Turnstile} from '@marsidev/react-turnstile';
import {observer} from 'mobx-react-lite';

interface TurnstileWidgetProps {
	sitekey: string;
	onVerify: (token: string) => void;
	onError?: (error: string) => void;
	onExpire?: () => void;
	theme?: 'light' | 'dark' | 'auto';
}

export const TurnstileWidget = observer(
	({sitekey, onVerify, onError, onExpire, theme = 'dark'}: TurnstileWidgetProps) => {
		return (
			<Turnstile
				siteKey={sitekey}
				onSuccess={onVerify}
				onError={() => onError?.('Turnstile error')}
				onExpire={onExpire}
				options={{
					theme,
				}}
			/>
		);
	},
);
