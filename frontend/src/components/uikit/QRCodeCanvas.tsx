/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import qrCode from 'qrcode';
import React from 'react';

export const QRCodeCanvas = observer(({data}: {data: string}) => {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);

	React.useEffect(() => {
		const canvas = canvasRef.current;
		const qrSize = 100;
		const padding = 10;
		const totalSize = qrSize + padding * 2;

		if (canvas) {
			canvas.width = totalSize;
			canvas.height = totalSize;
			const context = canvas.getContext('2d');
			if (context) {
				context.fillStyle = 'white';
				context.fillRect(0, 0, totalSize, totalSize);
				context.fillStyle = 'white';
				context.beginPath();
				context.moveTo(padding, 0);
				context.lineTo(totalSize - padding, 0);
				context.quadraticCurveTo(totalSize, 0, totalSize, padding);
				context.lineTo(totalSize, totalSize - padding);
				context.quadraticCurveTo(totalSize, totalSize, totalSize - padding, totalSize);
				context.lineTo(padding, totalSize);
				context.quadraticCurveTo(0, totalSize, 0, totalSize - padding);
				context.lineTo(0, padding);
				context.quadraticCurveTo(0, 0, padding, 0);
				context.closePath();
				context.fill();
				const tempCanvas = document.createElement('canvas');
				qrCode.toCanvas(
					tempCanvas,
					data,
					{width: qrSize, margin: 0, color: {dark: '#000000', light: '#FFFFFF00'}},
					(error: Error | null | undefined) => {
						if (error) {
							console.error(error);
						} else {
							context.drawImage(tempCanvas, padding, padding);
						}
					},
				);
			}
		}
	}, [data]);

	return <canvas ref={canvasRef} style={{borderRadius: 10, backgroundColor: 'white'}} />;
});
