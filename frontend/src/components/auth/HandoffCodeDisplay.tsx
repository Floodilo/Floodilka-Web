/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {CheckCircleIcon, ClipboardIcon} from '@phosphor-icons/react';
import {useCallback, useState} from 'react';
import * as TextCopyActionCreators from '~/actions/TextCopyActionCreators';
import {Button} from '~/components/uikit/Button/Button';
import i18n from '~/i18n';
import styles from './HandoffCodeDisplay.module.css';

interface HandoffCodeDisplayProps {
	code: string | null;
	isGenerating: boolean;
	error: string | null;
	onRetry?: () => void;
}

export function HandoffCodeDisplay({code, isGenerating, error, onRetry}: HandoffCodeDisplayProps) {
	const [copied, setCopied] = useState(false);

	const handleCopyCode = useCallback(async () => {
		if (!code) return;
		await TextCopyActionCreators.copy(i18n, code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}, [code]);

	if (isGenerating) {
		return (
			<div className={styles.container}>
				<h1 className={styles.title}>
					<Trans>Generating code...</Trans>
				</h1>
				<div className={styles.spinner}>
					<span className={styles.spinnerIcon} />
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className={styles.container}>
				<h1 className={styles.title}>
					<Trans>Something went wrong</Trans>
				</h1>
				<p className={styles.error}>{error}</p>
				{onRetry && (
					<Button onClick={onRetry} fitContainer>
						<Trans>Try again</Trans>
					</Button>
				)}
			</div>
		);
	}

	if (!code) {
		return null;
	}

	const codeWithoutHyphen = code.replace(/-/g, '');
	const codePart1 = codeWithoutHyphen.slice(0, 4);
	const codePart2 = codeWithoutHyphen.slice(4, 8);

	return (
		<div className={styles.container}>
			<h1 className={styles.title}>
				<Trans>Your code is ready!</Trans>
			</h1>
			<p className={styles.description}>
				<Trans>Paste it where you came from to complete sign-in.</Trans>
			</p>

			<div className={styles.codeSection}>
				<p className={styles.codeLabel}>
					<Trans>Your code</Trans>
				</p>
				<div className={styles.codeDisplay}>
					<span className={styles.codeChar}>{codePart1}</span>
					<span className={styles.codeSeparator}>-</span>
					<span className={styles.codeChar}>{codePart2}</span>
				</div>
				<Button
					type="button"
					onClick={handleCopyCode}
					leftIcon={copied ? <CheckCircleIcon size={16} weight="bold" /> : <ClipboardIcon size={16} />}
					variant="secondary"
				>
					{copied ? <Trans>Copied!</Trans> : <Trans>Copy code</Trans>}
				</Button>
			</div>
		</div>
	);
}
