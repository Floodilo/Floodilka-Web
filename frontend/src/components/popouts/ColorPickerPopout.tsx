/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {ColorArea, ColorPicker, ColorSlider, ColorThumb, parseColor, SliderTrack} from 'react-aria-components';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import styles from './ColorPickerPopout.module.css';

export const ColorPickerPopout = observer(
	({
		color,
		onChange,
		onReset,
	}: {
		popoutKey?: string | number;
		color: string;
		onChange: (color: string) => void;
		onReset: () => void;
	}) => {
		const hasCustomColor = color !== null && color !== '#4641D9';

		const handleColorChange = React.useCallback(
			(newColor: ReturnType<typeof parseColor>) => {
				onChange(newColor.toString('hex'));
			},
			[onChange],
		);

		const parsedColor = React.useMemo(() => {
			try {
				return parseColor(color).toFormat('hsb');
			} catch {
				return parseColor('#4641D9').toFormat('hsb');
			}
		}, [color]);

		return (
			<div className={styles.container}>
				<ColorPicker value={parsedColor} onChange={handleColorChange}>
					<div className={hasCustomColor ? styles.pickerContainerWithMargin : styles.pickerContainer}>
						<div className={styles.pickerWrapper}>
							<ColorArea colorSpace="hsb" xChannel="saturation" yChannel="brightness" className={styles.colorArea}>
								<ColorThumb className={styles.colorThumb} />
							</ColorArea>
							<ColorSlider channel="hue" className={styles.colorSlider}>
								<SliderTrack className={styles.sliderTrack}>
									<ColorThumb className={styles.colorThumb} />
								</SliderTrack>
							</ColorSlider>
						</div>
					</div>
				</ColorPicker>
				<FocusRing offset={-2}>
					<button type="button" className={styles.resetButton} onClick={onReset} disabled={!hasCustomColor}>
						<span className={styles.resetButtonText}>
							<Trans>Reset</Trans>
						</span>
					</button>
				</FocusRing>
			</div>
		);
	},
);
