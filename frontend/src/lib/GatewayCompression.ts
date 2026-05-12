/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {decompressZstdFrame} from '~/lib/libfluxcore';

export type CompressionType = 'none' | 'zstd-stream' | (string & {});

export class GatewayDecompressor {
	private readonly type: CompressionType;

	constructor(type: CompressionType) {
		this.type = type;
	}

	async decompress(data: ArrayBuffer): Promise<string> {
		const input = new Uint8Array(data);

		switch (this.type) {
			case 'none':
				return new TextDecoder().decode(input);

			case 'zstd-stream':
				return this.decompressZstd(input);

			default:
				throw new Error(`Unsupported compression type: ${this.type}`);
		}
	}

	private async decompressZstd(data: Uint8Array): Promise<string> {
		const wasmDecoded = await decompressZstdFrame(data);
		if (!wasmDecoded) {
			throw new Error('Gateway zstd WASM not available');
		}
		const decompressed = wasmDecoded;
		return new TextDecoder().decode(decompressed);
	}

	destroy(): void {}
}

export function getPreferredCompression(): CompressionType {
	return 'zstd-stream';
}

export function isCompressionSupported(type: CompressionType): boolean {
	switch (type) {
		case 'none':
		case 'zstd-stream':
			return true;
		default:
			return false;
	}
}
