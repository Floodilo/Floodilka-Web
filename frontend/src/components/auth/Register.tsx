/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {type FormEvent, useState} from 'react';
import * as AuthenticationActionCreators from '~/actions/AuthenticationActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {DateOfBirthField} from '~/components/auth/DateOfBirthField';
import {normalizePhoneToE164} from '~/data/countryCodes';
import {Routes} from '~/Routes';

interface RegisterProps {
	onSwitchToLogin: () => void;
	onVerificationRequired: (data: {email?: string; phone?: string; username: string; ticket: string}) => void;
}

export default function Register({onSwitchToLogin, onVerificationRequired}: RegisterProps) {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [phoneError, setPhoneError] = useState(false);
	const [dobError, setDobError] = useState(false);

	// DOB state
	const [dobMonth, setDobMonth] = useState('');
	const [dobDay, setDobDay] = useState('');
	const [dobYear, setDobYear] = useState('');

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setEmailError(false);
		setPhoneError(false);
		setDobError(false);

		const usernameRegex = /^[a-zA-Z0-9.]+$/;
		if (!usernameRegex.test(username)) {
			ToastActionCreators.error('Имя пользователя может содержать только английские буквы, цифры и точку');
			setLoading(false);
			return;
		}

		if (/\.{2,}/.test(username)) {
			ToastActionCreators.error('Имя пользователя не может содержать две или более точек подряд');
			setLoading(false);
			return;
		}

		if (username.length < 3) {
			ToastActionCreators.error('Имя пользователя должно содержать минимум 3 символа');
			setLoading(false);
			return;
		}

		if (!phone) {
			ToastActionCreators.error('Введите номер телефона');
			setPhoneError(true);
			setLoading(false);
			return;
		}

		const normalizedPhone = normalizePhoneToE164(phone);
		if (!normalizedPhone) {
			ToastActionCreators.error('Введите корректный номер телефона, например +7 999 123-45-67');
			setPhoneError(true);
			setLoading(false);
			return;
		}

		const trimmedEmail = email.trim();
		if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
			ToastActionCreators.error('Введите корректный email');
			setEmailError(true);
			setLoading(false);
			return;
		}

		if (password !== confirmPassword) {
			ToastActionCreators.error('Пароли не совпадают');
			setLoading(false);
			return;
		}

		if (password.length < 8) {
			ToastActionCreators.error('Пароль должен быть минимум 8 символов');
			setLoading(false);
			return;
		}

		if (!dobMonth || !dobDay || !dobYear) {
			ToastActionCreators.error('Укажите дату рождения');
			setLoading(false);
			return;
		}

		const dateOfBirth = `${dobYear}-${dobMonth.padStart(2, '0')}-${dobDay.padStart(2, '0')}`;

		try {
			const response = await AuthenticationActionCreators.register({
				username,
				phone: normalizedPhone,
				...(trimmedEmail ? {email: trimmedEmail} : {}),
				password,
				date_of_birth: dateOfBirth,
				consent: true,
			});

			onVerificationRequired({phone: normalizedPhone, username, ticket: response.ticket});
		} catch (err) {
			const error = err as {body?: {message?: string; errors?: Array<{path: string; message: string}>}; message?: string};
			let errorMessage = 'Ошибка при регистрации';
			if (error.body?.errors?.length) {
				errorMessage = [...new Set(error.body.errors.map((e) => e.message))].join(', ');
				const errorPaths = new Set(error.body.errors.map((e) => e.path));
				if (errorPaths.has('date_of_birth')) {
					setDobError(true);
				}
				if (errorPaths.has('email')) {
					setEmailError(true);
				}
				if (errorPaths.has('phone')) {
					setPhoneError(true);
				}
			} else if (error.body?.message && error.body.message !== 'Input Validation Error') {
				errorMessage = error.body.message;
			}
			ToastActionCreators.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const isDobComplete = dobMonth !== '' && dobDay !== '' && dobYear !== '';
	const isEmailValid = email.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
	const isPhoneValid = phone.length > 0 && normalizePhoneToE164(phone) !== null;
	const isPasswordLongEnough = password.length >= 8;
	const doPasswordsMatch = password === confirmPassword;
	const showPasswordHints = (password.length > 0 || confirmPassword.length > 0) && !(isPasswordLongEnough && doPasswordsMatch);
	const isFormValid =
		username.length >= 3 && isPhoneValid && isEmailValid && isPasswordLongEnough && doPasswordsMatch && isDobComplete;

	return (
		<>
			<form className="auth-form" onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Никнейм</label>
					<input
						type="text"
						placeholder="Придумай никнейм"
						value={username}
						onChange={(e) => {
							const value = e.target.value;
							if (value === '' || /^[a-zA-Z0-9.]*$/.test(value)) {
								setUsername(value.toLowerCase());
							}
						}}
						required
						minLength={3}
						maxLength={20}
						disabled={loading}
						autoFocus
					/>
				</div>

				<div className="form-group">
					<label>Номер телефона</label>
					<input
						type="tel"
						placeholder="+7 999 123-45-67"
						value={phone}
						onChange={(e) => {
							setPhone(e.target.value);
							setPhoneError(false);
						}}
						required
						disabled={loading}
						className={phoneError ? 'input-error' : ''}
					/>
				</div>

				<div className="form-group">
					<label>Email</label>
					<input
						type="email"
						placeholder="Email (необязательно)"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value);
							setEmailError(false);
						}}
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
							onChange={(e) => setPassword(e.target.value)}
							required
							minLength={8}
							disabled={loading}
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

				<div className="form-group">
					<label>Повторите пароль</label>
					<div className="password-input-wrapper">
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							placeholder="Повторить пароль"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							minLength={8}
							disabled={loading}
						/>
						<button
							type="button"
							className="password-toggle-btn"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							tabIndex={-1}
						>
							<img
								src={showConfirmPassword ? '/icons/eye.png' : '/icons/eye_closed.png'}
								alt={showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'}
								className="password-toggle-icon"
							/>
						</button>
					</div>
				</div>

				{showPasswordHints && (
					<div className="password-hints">
						<span className={`password-hint ${isPasswordLongEnough ? 'met' : ''}`}>
							{isPasswordLongEnough ? '✓' : '•'} Минимум 8 символов
						</span>
						<span className={`password-hint ${confirmPassword.length > 0 && doPasswordsMatch ? 'met' : ''}`}>
							{confirmPassword.length > 0 && doPasswordsMatch ? '✓' : '•'} Пароли совпадают
						</span>
					</div>
				)}

				<div className="dob-container">
					<DateOfBirthField
						selectedMonth={dobMonth}
						selectedDay={dobDay}
						selectedYear={dobYear}
						onMonthChange={(v) => { setDobMonth(v); setDobError(false); }}
						onDayChange={(v) => { setDobDay(v); setDobError(false); }}
						onYearChange={(v) => { setDobYear(v); setDobError(false); }}
						error={dobError}
					/>
				</div>

				<button
					type="submit"
					className={`auth-submit-btn ${isFormValid ? 'active' : ''}`}
					disabled={loading || !isFormValid}
				>
					{loading ? 'Регистрация...' : 'Создать аккаунт'}
				</button>
			</form>

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
