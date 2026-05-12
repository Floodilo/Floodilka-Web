/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {type Action, INITIAL_FORM_VALUES, type State} from './types';

export const createInitialState = (): State => ({
	selectedType: null,
	flowStep: 'selection',

	email: '',
	verificationCode: '',
	ticket: null,

	formValues: {...INITIAL_FORM_VALUES},

	isSendingCode: false,
	isVerifying: false,
	isSubmitting: false,

	errorMessage: null,
	successReportId: null,

	resendCooldownSeconds: 0,

	fieldErrors: {},
});

export function reducer(state: State, action: Action): State {
	switch (action.type) {
		case 'RESET_ALL':
			return createInitialState();

		case 'SELECT_TYPE':
			return {
				...createInitialState(),
				selectedType: action.reportType,
				flowStep: 'email',
			};

		case 'GO_TO_SELECTION':
			return {
				...createInitialState(),
			};

		case 'GO_TO_EMAIL':
			return {
				...state,
				flowStep: 'email',
				verificationCode: '',
				ticket: null,
				isVerifying: false,
				errorMessage: null,
				resendCooldownSeconds: 0,
				fieldErrors: {},
			};

		case 'GO_TO_VERIFICATION':
			return {
				...state,
				flowStep: 'verification',
				verificationCode: '',
				ticket: null,
				errorMessage: null,
				resendCooldownSeconds: 0,
				fieldErrors: {},
			};

		case 'GO_TO_DETAILS':
			return {
				...state,
				flowStep: 'details',
				errorMessage: null,
				fieldErrors: {},
			};

		case 'SET_ERROR':
			return {...state, errorMessage: action.message};

		case 'SET_EMAIL':
			return {...state, email: action.email, errorMessage: null};

		case 'SET_VERIFICATION_CODE':
			return {...state, verificationCode: action.code, errorMessage: null};

		case 'SET_TICKET':
			return {...state, ticket: action.ticket};

		case 'SET_FORM_FIELD':
			return {
				...state,
				formValues: {...state.formValues, [action.field]: action.value},
				errorMessage: null,
				fieldErrors: {...state.fieldErrors, [action.field]: undefined},
			};

		case 'SENDING_CODE':
			return {...state, isSendingCode: action.value};

		case 'VERIFYING':
			return {...state, isVerifying: action.value};

		case 'SUBMITTING':
			return {...state, isSubmitting: action.value};

		case 'SUBMIT_SUCCESS':
			return {
				...state,
				successReportId: action.reportId,
				flowStep: 'complete',
				isSubmitting: false,
				errorMessage: null,
				fieldErrors: {},
			};

		case 'START_RESEND_COOLDOWN':
			return {...state, resendCooldownSeconds: action.seconds};

		case 'TICK_RESEND_COOLDOWN':
			return {...state, resendCooldownSeconds: Math.max(0, state.resendCooldownSeconds - 1)};

		case 'SET_FIELD_ERRORS':
			return {...state, fieldErrors: action.errors};

		case 'CLEAR_FIELD_ERRORS':
			return {...state, fieldErrors: {}};

		case 'CLEAR_FIELD_ERROR': {
			const next = {...state.fieldErrors};
			delete next[action.field];
			return {...state, fieldErrors: next};
		}

		default:
			return state;
	}
}
