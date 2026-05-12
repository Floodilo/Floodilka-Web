/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Readable} from 'node:stream';
import type {ReadableStream as WebReadableStream} from 'node:stream/web';

type BinaryLike = ArrayBufferView | ArrayBuffer;

export const toBodyData = (value: BinaryLike): Uint8Array<ArrayBuffer> => {
	if (value instanceof ArrayBuffer) {
		return new Uint8Array(value);
	}

	if (value.buffer instanceof ArrayBuffer) {
		return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
	}

	const copyBuffer = new ArrayBuffer(value.byteLength);
	const view = new Uint8Array(copyBuffer);
	view.set(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
	return new Uint8Array(copyBuffer);
};

export const toWebReadableStream = (stream: Readable): WebReadableStream<Uint8Array> => {
	return Readable.toWeb(stream);
};
