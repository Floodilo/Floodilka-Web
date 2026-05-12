/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {readdir, readFile, unlink} from 'node:fs/promises';
import {join} from 'node:path';

const token = process.env.HAWK_INTEGRATION_TOKEN;
const release = process.env.PUBLIC_BUILD_SHA;
const distDir = process.env.HAWK_DIST_DIR ?? 'dist';

if (!token) {
	console.log('HAWK_INTEGRATION_TOKEN is not set, skipping sourcemap upload');
	process.exit(0);
}

if (!release) {
	console.error('PUBLIC_BUILD_SHA is required to tag sourcemaps with a release');
	process.exit(1);
}

let integrationId;
try {
	const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
	integrationId = decoded.integrationId;
} catch {
	console.error('HAWK_INTEGRATION_TOKEN is not a valid base64-encoded JSON');
	process.exit(1);
}

if (!integrationId) {
	console.error('HAWK_INTEGRATION_TOKEN does not contain an integrationId');
	process.exit(1);
}

const endpoint = `https://${integrationId}.k1.hawk.so/release`;

async function findMaps(dir) {
	const entries = await readdir(dir, {withFileTypes: true});
	const result = [];
	for (const entry of entries) {
		const full = join(dir, entry.name);
		if (entry.isDirectory()) {
			result.push(...(await findMaps(full)));
		} else if (entry.name.endsWith('.map')) {
			result.push(full);
		}
	}
	return result;
}

const maps = await findMaps(distDir);
console.log(`🦅 Hawk | Found ${maps.length} sourcemap file(s) in ${distDir}`);

if (maps.length === 0) {
	process.exit(0);
}

let uploaded = 0;
let failed = 0;

for (const mapPath of maps) {
	const name = mapPath.split('/').pop();
	try {
		const buf = await readFile(mapPath);
		const form = new FormData();
		form.append('release', release);
		form.append('file', new Blob([buf]), name);

		const response = await fetch(endpoint, {
			method: 'POST',
			headers: {Authorization: `Bearer ${token}`},
			body: form,
		});

		if (response.ok) {
			await unlink(mapPath);
			uploaded++;
			console.log(`🦅 Hawk | ${name} → sent`);
		} else {
			failed++;
			const body = await response.text();
			console.warn(`🦅 Hawk | ${name} → failed (${response.status}): ${body}`);
		}
	} catch (error) {
		failed++;
		console.warn(`🦅 Hawk | ${name} → error: ${error.message}`);
	}
}

console.log(`🦅 Hawk | Done: ${uploaded} uploaded, ${failed} failed`);
