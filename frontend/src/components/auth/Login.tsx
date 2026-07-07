/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {type FormEvent, useState} from 'react';
import * as AuthenticationActionCreators from '~/actions/AuthenticationActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {normalizePhoneToE164} from '~/data/countryCodes';
import {Routes} from '~/Routes';
import type {LoginSuccessPayload, MfaChallenge} from '~/viewmodels/auth/AuthFlow';

// Ввод считается телефоном, если состоит из цифр и телефонных символов
// (+, пробелы, скобки, дефисы, точки) и не содержит '@'.
const looksLikePhone = (value: string): boolean => /^[+]?[\d\s()\-.]+$/.test(value.trim());

interface LoginProps {
	onSwitchToRegister: () => void;
	onForgotPassword: () => void;
	onMfaRequired: (challenge: MfaChallenge) => void;
	onLoginSuccess: (payload: LoginSuccessPayload) => void;
}

export default function Login({onSwitchToRegister, onForgotPassword, onMfaRequired, onLoginSuccess}: LoginProps) {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setEmailError(false);
		setPasswordError(false);
		setLoading(true);

		const trimmed = email.trim();
		let credentials: {email?: string; phone?: string};
		if (looksLikePhone(trimmed)) {
			const normalizedPhone = normalizePhoneToE164(trimmed);
			if (!normalizedPhone) {
				setEmailError(true);
				ToastActionCreators.error('Введите корректный номер телефона, например +7 999 123-45-67');
				setLoading(false);
				return;
			}
			credentials = {phone: normalizedPhone};
		} else {
			credentials = {email: trimmed};
		}

		try {
			const response = await AuthenticationActionCreators.login({...credentials, password});

			if (response.mfa) {
				onMfaRequired({
					ticket: response.ticket,
					sms: response.sms,
					totp: response.totp,
					webauthn: response.webauthn,
				});
				return;
			}

			onLoginSuccess({
				token: response.token,
				userId: response.user_id,
			});
		} catch (err) {
			const error = err as {body?: {message?: string; errors?: Array<{path: string; message: string}>}; message?: string};
			let errorMessage = 'Неверно введены email/телефон или пароль';
			if (error.body?.errors?.length) {
				errorMessage = [...new Set(error.body.errors.map((e) => e.message))].join(', ');
			} else if (error.body?.message && error.body.message !== 'Input Validation Error') {
				errorMessage = error.body.message;
			}
			setEmailError(true);
			setPasswordError(true);
			ToastActionCreators.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const isFormValid = email.length > 0 && password.length >= 6;

	return (
		<>
			<form className="auth-form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Email или телефон</label>
					<input
						type="text"
						autoComplete="username"
						placeholder="Email или номер телефона"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setEmailError(false);
						}}
						required
						disabled={loading}
						className={emailError ? 'input-error' : ''}
					/>
				</div>

				<div className="form-group">
					<label>Пароль</label>
					<div className="password-input-wrapper">
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder="Пароль"
							value={password}
							onChange={(e) => {
								setPassword(e.target.value);
								setPasswordError(false);
							}}
							required
							minLength={6}
							disabled={loading}
							className={passwordError ? 'input-error' : ''}
						/>
						<button
							type="button"
							className="password-toggle-btn"
							onClick={() => setShowPassword(!showPassword)}
							tabIndex={-1}
						>
							<img
								src={showPassword ? '/icons/eye.png' : '/icons/eye_closed.png'}
								alt={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
								className="password-toggle-icon"
							/>
						</button>
					</div>
				</div>

				<div className="forgot-password">
					<button type="button" className="forgot-password-link" onClick={onForgotPassword}>
						Не помню пароль
					</button>
				</div>

				<button
					type="submit"
					className={`auth-submit-btn ${isFormValid ? 'active' : ''}`}
					disabled={loading || !isFormValid}
				>
					{loading ? 'Вход...' : 'Войти'}
				</button>
			</form>

			<div className="auth-switch">
				<button type="button" onClick={onSwitchToRegister} className="auth-switch-btn">
					Создать аккаунт
				</button>
			</div>

			<div className="auth-terms">
				Продолжая, ты принимаешь{' '}
				<a href={Routes.privacy()} target="_blank" rel="noopener noreferrer">
					политику конфиденциальности
				</a>{' '}
				и{' '}
				<a href={Routes.terms()} target="_blank" rel="noopener noreferrer">
					правила сервиса
				</a>
			</div>
		</>
	);
}
