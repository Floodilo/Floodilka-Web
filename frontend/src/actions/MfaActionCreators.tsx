/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Endpoints} from '~/Endpoints';
import http from '~/lib/HttpClient';
import {Logger} from '~/lib/Logger';
import type {BackupCode} from '~/records/UserRecord';
import SudoStore from '~/stores/SudoStore';

const logger = new Logger('MFA');

export const enableMfaTotp = async (secret: string, code: string): Promise<Array<BackupCode>> => {
	try {
		logger.debug('Enabling TOTP-based MFA');
		const response = await http.post<{backup_codes: Array<BackupCode>}>({
			url: Endpoints.USER_MFA_TOTP_ENABLE,
			body: {secret, code},
		});
		const result = response.body;
		logger.debug('Successfully enabled TOTP-based MFA');
		SudoStore.clearToken();
		return result.backup_codes;
	} catch (error) {
		logger.error('Failed to enable TOTP-based MFA:', error);
		throw error;
	}
};

export const disableMfaTotp = async (code: string): Promise<void> => {
	try {
		logger.debug('Disabling TOTP-based MFA');
		await http.post({url: Endpoints.USER_MFA_TOTP_DISABLE, body: {code, mfa_method: 'totp', mfa_code: code}});
		logger.debug('Successfully disabled TOTP-based MFA');
	} catch (error) {
		logger.error('Failed to disable TOTP-based MFA:', error);
		throw error;
	}
};

export const getBackupCodes = async (regenerate = false): Promise<Array<BackupCode>> => {
	try {
		logger.debug(`${regenerate ? 'Regenerating' : 'Fetching'} MFA backup codes`);
		const response = await http.post<{backup_codes: Array<BackupCode>}>({
			url: Endpoints.USER_MFA_BACKUP_CODES,
			body: {regenerate},
		});
		const result = response.body;

		logger.debug(`Successfully ${regenerate ? 'regenerated' : 'fetched'} MFA backup codes`);
		return result.backup_codes;
	} catch (error) {
		logger.error(`Failed to ${regenerate ? 'regenerate' : 'fetch'} MFA backup codes:`, error);
		throw error;
	}
};
