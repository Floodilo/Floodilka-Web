/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import type {AnchorHTMLAttributes, FC, MouseEventHandler} from 'react';
import {useRef} from 'react';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {openExternalUrl} from '~/utils/NativeUtils';
import styles from './ExternalLink.module.css';

type ExternalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
	href: string;
	children: React.ReactNode;
};

export const ExternalLink: FC<ExternalLinkProps> = observer(({href, children, className, ...props}) => {
	const linkRef = useRef<HTMLAnchorElement>(null);

	const handleClick: MouseEventHandler<HTMLAnchorElement> = async (event) => {
		event.preventDefault();
		event.stopPropagation();
		await openExternalUrl(href);
	};

	return (
		<FocusRing ringTarget={linkRef}>
			<a
				ref={linkRef}
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				className={clsx(styles.externalLink, className)}
				onClick={handleClick}
				{...props}
			>
				{children}
			</a>
		</FocusRing>
	);
});
