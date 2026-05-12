/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

const {notarize} = require('@electron/notarize');

exports.default = async function notarizing(context) {
	const {electronPlatformName, appOutDir} = context;

	if (electronPlatformName !== 'darwin') {
		return;
	}

	if (!process.env.APPLE_ID || !process.env.APPLE_APP_SPECIFIC_PASSWORD || !process.env.APPLE_TEAM_ID) {
		console.log('Skipping notarization: Apple credentials not set');
		return;
	}

	const appName = context.packager.appInfo.productFilename;
	const appPath = `${appOutDir}/${appName}.app`;

	console.log(`Notarizing ${appPath}...`);

	try {
		await notarize({
			tool: 'notarytool',
			appPath,
			appleId: process.env.APPLE_ID,
			appleIdPassword: process.env.APPLE_APP_SPECIFIC_PASSWORD,
			teamId: process.env.APPLE_TEAM_ID,
		});
		console.log('Notarization complete');
	} catch (error) {
		console.error('Notarization failed:', error);
		throw error;
	}
};
