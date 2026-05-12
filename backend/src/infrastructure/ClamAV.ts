/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import fs from 'node:fs/promises';
import {createConnection} from 'node:net';
import {Config} from '~/Config';

interface ScanResult {
	isClean: boolean;
	virus?: string;
}

const MAX_RESPONSE_SIZE = 10 * 1024 * 1024;
const CONNECT_TIMEOUT_MS = 5000;

export class ClamAV {
	constructor(
		private host = Config.clamav.host!,
		private port = Config.clamav.port!,
	) {}

	async scanFile(filePath: string): Promise<ScanResult> {
		const buffer = await fs.readFile(filePath);
		return this.scanBuffer(buffer);
	}

	async scanBuffer(buffer: Buffer): Promise<ScanResult> {
		return new Promise((resolve, reject) => {
			let isResolved = false;

			const finish = (fn: typeof resolve | typeof reject, value: ScanResult | Error) => {
				if (isResolved) return;
				isResolved = true;
				clearTimeout(connectTimeout);
				socket.destroy();
				(fn as (v: ScanResult | Error) => void)(value);
			};

			const socket = createConnection(this.port, this.host);
			let response = '';

			const connectTimeout = setTimeout(() => {
				finish(reject, new Error('ClamAV connection timed out'));
			}, CONNECT_TIMEOUT_MS);

			socket.on('connect', () => {
				clearTimeout(connectTimeout);

				try {
					socket.write('zINSTREAM\0');

					const chunkSize = Math.min(buffer.length, 2048);
					let offset = 0;

					while (offset < buffer.length) {
						const remainingBytes = buffer.length - offset;
						const bytesToSend = Math.min(chunkSize, remainingBytes);

						const sizeBuffer = Buffer.alloc(4);
						sizeBuffer.writeUInt32BE(bytesToSend, 0);
						socket.write(sizeBuffer);

						socket.write(buffer.subarray(offset, offset + bytesToSend));
						offset += bytesToSend;
					}

					const endBuffer = Buffer.alloc(4);
					endBuffer.writeUInt32BE(0, 0);
					socket.write(endBuffer);
				} catch (error) {
					finish(reject, new Error(`ClamAV write failed: ${error instanceof Error ? error.message : String(error)}`));
				}
			});

			socket.on('data', (data) => {
				response += data.toString();
				if (response.length > MAX_RESPONSE_SIZE) {
					finish(reject, new Error('ClamAV response exceeded maximum size'));
				}
			});

			socket.on('end', () => {
				const trimmedResponse = response.trim();

				if (trimmedResponse.includes('FOUND')) {
					const virusMatch = trimmedResponse.match(/:\s(.+)\sFOUND/);
					const virus = virusMatch ? virusMatch[1] : 'Virus detected';

					finish(resolve, {
						isClean: false,
						virus,
					});
				} else if (trimmedResponse.includes('OK')) {
					finish(resolve, {
						isClean: true,
					});
				} else {
					finish(reject, new Error(`Unexpected ClamAV response: ${trimmedResponse}`));
				}
			});

			socket.on('error', (error) => {
				finish(reject, new Error(`ClamAV connection failed: ${error.message}`));
			});
		});
	}
}
