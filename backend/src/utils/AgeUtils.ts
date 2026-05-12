/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export const calculateAge = (dateOfBirth: {year: number; month: number; day: number} | string): number => {
	const today = new Date();

	let birthDate: Date;

	if (typeof dateOfBirth === 'string') {
		const [year, month, day] = dateOfBirth.split('-').map(Number);
		birthDate = new Date(year, month - 1, day);
	} else {
		birthDate = new Date(dateOfBirth.year, dateOfBirth.month - 1, dateOfBirth.day);
	}

	const age = today.getFullYear() - birthDate.getFullYear();
	const monthDiff = today.getMonth() - birthDate.getMonth();
	const dayDiff = today.getDate() - birthDate.getDate();

	return monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
};

export const isUserAdult = (dateOfBirth?: {year: number; month: number; day: number} | string | null): boolean => {
	if (!dateOfBirth) return false;
	return calculateAge(dateOfBirth) >= 18;
};
