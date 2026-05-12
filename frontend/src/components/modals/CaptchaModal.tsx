/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import HCaptcha from '@hcaptcha/react-hcaptcha';
import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import {useCallback, useEffect, useRef, useState} from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {TurnstileWidget} from '~/components/captcha/TurnstileWidget';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import RuntimeConfigStore from '~/stores/RuntimeConfigStore';
import styles from './CaptchaModal.module.css';

export type CaptchaType = 'turnstile' | 'hcaptcha';

interface CaptchaModalProps {
	onVerify: (token: string, captchaType: CaptchaType) => void;
	onCancel?: () => void;
	preferredType?: CaptchaType;
	error?: string | null;
	isVerifying?: boolean;
	closeOnVerify?: boolean;
}

export const CaptchaModal = observer(
	({onVerify, onCancel, preferredType, error, isVerifying, closeOnVerify = true}: CaptchaModalProps) => {
		const {t} = useLingui();
		const hcaptchaRef = useRef<HCaptcha>(null);
		const [captchaType, setCaptchaType] = useState<CaptchaType>(() => {
			if (preferredType) return preferredType;

			if (RuntimeConfigStore.captchaProvider === 'turnstile' && RuntimeConfigStore.turnstileSiteKey) {
				return 'turnstile';
			}
			if (RuntimeConfigStore.captchaProvider === 'hcaptcha' && RuntimeConfigStore.hcaptchaSiteKey) {
				return 'hcaptcha';
			}

			return RuntimeConfigStore.turnstileSiteKey ? 'turnstile' : 'hcaptcha';
		});

		useEffect(() => {
			if (captchaType === 'hcaptcha') {
				const timer = setTimeout(() => {
					hcaptchaRef.current?.resetCaptcha();
				}, 100);
				return () => clearTimeout(timer);
			}
			return;
		}, [captchaType]);

		useEffect(() => {
			if (error) {
				if (captchaType === 'hcaptcha') {
					hcaptchaRef.current?.resetCaptcha();
				}
			}
		}, [error, captchaType]);

		const handleVerify = useCallback(
			(token: string) => {
				onVerify(token, captchaType);
				if (closeOnVerify) {
					ModalActionCreators.pop();
				}
			},
			[onVerify, captchaType, closeOnVerify],
		);

		const handleCancel = useCallback(() => {
			onCancel?.();
			ModalActionCreators.pop();
		}, [onCancel]);

		const handleExpire = useCallback(() => {
			if (captchaType === 'hcaptcha') {
				hcaptchaRef.current?.resetCaptcha();
			}
		}, [captchaType]);

		const handleError = useCallback(
			(error: string) => {
				console.error(`${captchaType} error:`, error);
			},
			[captchaType],
		);

		const handleSwitchToHCaptcha = useCallback(() => {
			setCaptchaType('hcaptcha');
		}, []);

		const handleSwitchToTurnstile = useCallback(() => {
			setCaptchaType('turnstile');
		}, []);

		const showSwitchButton =
			(captchaType === 'turnstile' && RuntimeConfigStore.hcaptchaSiteKey) ||
			(captchaType === 'hcaptcha' && RuntimeConfigStore.turnstileSiteKey);

		return (
			<Modal.Root size="small" centered onClose={handleCancel}>
				<Modal.Header title={t`Verify You're Human`} onClose={handleCancel} />
				<Modal.Content>
					<div className={styles.container}>
						<p className={styles.description}>
							<Trans>We need to make sure you're not a bot. Please complete the verification below.</Trans>
						</p>

						{error && (
							<div className={styles.errorBox}>
								<p className={styles.errorText}>{error}</p>
							</div>
						)}

						<div className={styles.captchaContainer}>
							{captchaType === 'turnstile' ? (
								<TurnstileWidget
									sitekey={RuntimeConfigStore.turnstileSiteKey ?? ''}
									onVerify={handleVerify}
									onExpire={handleExpire}
									onError={handleError}
									theme="dark"
								/>
							) : (
								<HCaptcha
									ref={hcaptchaRef}
									sitekey={RuntimeConfigStore.hcaptchaSiteKey ?? ''}
									onVerify={handleVerify}
									onExpire={handleExpire}
									onError={handleError}
									theme="dark"
								/>
							)}
						</div>

						{showSwitchButton && (
							<div className={styles.switchContainer}>
								<button
									type="button"
									onClick={captchaType === 'turnstile' ? handleSwitchToHCaptcha : handleSwitchToTurnstile}
									className={styles.switchButton}
									disabled={isVerifying}
								>
									{captchaType === 'turnstile' ? (
										<Trans>Having issues? Try hCaptcha instead</Trans>
									) : (
										<Trans>Try Turnstile instead</Trans>
									)}
								</button>
							</div>
						)}
					</div>
				</Modal.Content>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCancel} disabled={isVerifying}>
						<Trans>Cancel</Trans>
					</Button>
				</Modal.Footer>
			</Modal.Root>
		);
	},
);
