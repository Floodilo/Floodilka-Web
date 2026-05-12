/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import * as ort from 'onnxruntime-node';
import sharp from 'sharp';
import {Config} from '../Config';

const MODEL_SIZE = 224;

interface NSFWCheckResult {
	isNSFW: boolean;
	probability: number;
	predictions?: {
		drawing: number;
		hentai: number;
		neutral: number;
		porn: number;
		sexy: number;
	};
}

export class NSFWDetectionService {
	private session: ort.InferenceSession | null = null;
	private readonly NSFW_THRESHOLD = 0.85;

	async initialize(): Promise<void> {
		const modelPath =
			Config.NODE_ENV === 'production' ? '/opt/data/model.onnx' : path.join(process.cwd(), 'data', 'model.onnx');

		const modelBuffer = await fs.readFile(modelPath);
		this.session = await ort.InferenceSession.create(modelBuffer);
	}

	async checkNSFW(filePath: string): Promise<NSFWCheckResult> {
		const buffer = await fs.readFile(filePath);
		return this.checkNSFWBuffer(buffer);
	}

	async checkNSFWBuffer(buffer: Buffer): Promise<NSFWCheckResult> {
		if (!this.session) {
			throw new Error('NSFW Detection service not initialized');
		}

		const processedImage = await this.preprocessImage(buffer);
		const tensor = new ort.Tensor('float32', processedImage, [1, MODEL_SIZE, MODEL_SIZE, 3]);

		const feeds = {input: tensor};
		const results = await this.session.run(feeds);

		const outputTensor = results.prediction;
		if (!outputTensor || !outputTensor.data) {
			throw new Error('ONNX model output tensor data is undefined');
		}

		const predictions = Array.from(outputTensor.data as Float32Array);

		const predictionMap = {
			drawing: predictions[0],
			// NOTE: hentai: predictions[1], gives false positives
			hentai: 0,
			neutral: predictions[2],
			porn: predictions[3],
			sexy: predictions[4],
		};

		const nsfwProbability = predictionMap.hentai + predictionMap.porn + predictionMap.sexy;

		return {
			isNSFW: nsfwProbability > this.NSFW_THRESHOLD,
			probability: nsfwProbability,
			predictions: predictionMap,
		};
	}

	private async preprocessImage(buffer: Buffer): Promise<Float32Array> {
		const imageBuffer = await sharp(buffer)
			.resize(MODEL_SIZE, MODEL_SIZE, {fit: 'fill'})
			.removeAlpha()
			.raw()
			.toBuffer();

		const float32Array = new Float32Array(MODEL_SIZE * MODEL_SIZE * 3);

		for (let i = 0; i < imageBuffer.length; i++) {
			float32Array[i] = imageBuffer[i] / 255.0;
		}

		return float32Array;
	}
}
