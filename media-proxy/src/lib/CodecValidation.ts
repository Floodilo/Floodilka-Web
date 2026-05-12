/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import fs from 'node:fs/promises';
import type {Context} from 'hono';
import {temporaryFile} from 'tempy';
import {Logger} from '~/Logger';
import {type FFprobeStream, ffprobe} from '~/lib/FFmpegUtils';
import type {HonoEnv} from '~/lib/MediaTypes';
import {MEDIA_TYPES} from '~/lib/MediaTypes';

interface AudioStream extends FFprobeStream {
	codec_type: 'audio';
}

const matchesCodecPattern = (codec: string, patterns: Set<string>): boolean => {
	if (!codec) return false;
	const lowerCodec = codec.toLowerCase();
	return (
		patterns.has(lowerCodec) ||
		Array.from(patterns).some((pattern) => {
			if (pattern.includes('*')) {
				return new RegExp(`^${pattern.replace('*', '.*')}$`).test(lowerCodec);
			}
			return false;
		})
	);
};

const isProRes4444 = (codec: string): boolean => {
	if (!codec) return false;
	const lowercaseCodec = codec.toLowerCase();
	return (
		matchesCodecPattern(lowercaseCodec, MEDIA_TYPES.VIDEO.bannedCodecs) ||
		(lowercaseCodec.includes('prores') && lowercaseCodec.includes('4444'))
	);
};

export const validateCodecs = async (buffer: Buffer, filename: string, ctx: Context<HonoEnv>): Promise<boolean> => {
	const ext = filename.split('.').pop()?.toLowerCase();
	if (!ext) return false;

	const tempPath = temporaryFile({extension: ext});
	ctx.get('tempFiles').push(tempPath);

	try {
		await fs.writeFile(tempPath, buffer);
		const probeData = await ffprobe(tempPath);

		if (filename.toLowerCase().endsWith('.ogg')) {
			const hasVideo = probeData.streams?.some((stream) => stream.codec_type === 'video');
			if (hasVideo) return false;

			const audioStream = probeData.streams?.find((stream): stream is AudioStream => stream.codec_type === 'audio');
			return Boolean(audioStream?.codec_name && ['opus', 'vorbis'].includes(audioStream.codec_name));
		}

		const validateStream = (stream: FFprobeStream, type: 'video' | 'audio') => {
			const codec = stream.codec_name || '';
			if (type === 'video') {
				if (isProRes4444(codec)) return false;
				return matchesCodecPattern(codec, MEDIA_TYPES.VIDEO.codecs);
			}
			return matchesCodecPattern(codec, MEDIA_TYPES.AUDIO.codecs);
		};

		for (const stream of probeData.streams || []) {
			if (stream.codec_type !== 'video' && stream.codec_type !== 'audio') continue;
			if (!stream.codec_name) continue;
			if (!validateStream(stream, stream.codec_type)) {
				Logger.debug({filename, codec: stream.codec_name}, `Unsupported ${stream.codec_type} codec`);
				return false;
			}
		}
		return true;
	} catch (err) {
		Logger.error({error: err, filename}, 'Failed to validate media codecs');
		return false;
	}
};
