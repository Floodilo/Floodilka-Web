/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {temporaryFile} from 'tempy';

const execFileAsync = promisify(execFile);

export interface FFprobeStream {
	codec_name?: string;
	codec_type?: string;
}

interface FFprobeFormat {
	format_name?: string;
	duration?: string;
	size?: string;
}

interface FFprobeResult {
	streams?: Array<FFprobeStream>;
	format?: FFprobeFormat;
}

const parseProbeOutput = (stdout: string): FFprobeResult => {
	const parsed = JSON.parse(stdout) as unknown;
	if (!parsed || typeof parsed !== 'object') {
		throw new Error('Invalid ffprobe output');
	}
	return parsed as FFprobeResult;
};

export const ffprobe = async (path: string): Promise<FFprobeResult> => {
	const {stdout} = await execFileAsync('ffprobe', [
		'-v',
		'quiet',
		'-print_format',
		'json',
		'-show_format',
		'-show_streams',
		path,
	]);
	return parseProbeOutput(stdout);
};

export const hasVideoStream = async (path: string): Promise<boolean> => {
	const probeResult = await ffprobe(path);
	return probeResult.streams?.some((stream) => stream.codec_type === 'video') ?? false;
};

export const createThumbnail = async (videoPath: string): Promise<string> => {
	const hasVideo = await hasVideoStream(videoPath);
	if (!hasVideo) {
		throw new Error('File does not contain a video stream');
	}
	const thumbnailPath = temporaryFile({extension: 'jpg'});
	await execFileAsync('ffmpeg', ['-i', videoPath, '-vf', 'select=eq(n\\,0)', '-vframes', '1', thumbnailPath]);
	return thumbnailPath;
};
