/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import React from 'react';
import {MenuItem as AriaMenuItem} from 'react-aria-components';
import {Slider} from '../Slider';
import styles from './MenuItem.module.css';

interface MenuItemSliderProps {
	label: string;
	value: number;
	minValue?: number;
	maxValue?: number;
	disabled?: boolean;
	onChange?: (value: number) => void;
	onFormat?: (value: number) => string;
}

export const MenuItemSlider = React.forwardRef<HTMLDivElement, MenuItemSliderProps>(
	({label, value, minValue = 0, maxValue = 100, disabled = false, onChange, onFormat}, forwardedRef) => {
		const [localValue, setLocalValue] = React.useState(value);

		React.useEffect(() => {
			setLocalValue(value);
		}, [value]);

		const formattedValue = onFormat ? onFormat(localValue) : `${Math.round(localValue)}%`;

		const handleValueChange = React.useCallback(
			(newValue: number) => {
				setLocalValue(newValue);
				onChange?.(newValue);
			},
			[onChange],
		);

		const handleValueCommit = React.useCallback(
			(newValue: number) => {
				onChange?.(newValue);
			},
			[onChange],
		);

		const handleSliderInteraction = React.useCallback((e: React.SyntheticEvent) => {
			e.stopPropagation();
			e.preventDefault();
		}, []);

		return (
			<AriaMenuItem
				ref={forwardedRef}
				className={clsx(styles.sliderItem, {
					[styles.disabled]: disabled,
				})}
				isDisabled={disabled}
				textValue={label}
			>
				{/* biome-ignore lint/a11y/noStaticElementInteractions: interactive slider element */}
				<div
					onClick={handleSliderInteraction}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
						}
					}}
					style={{width: '100%'}}
				>
					<div className={styles.sliderHeader}>
						<span className={styles.sliderLabel}>{label}</span>
						<span className={styles.sliderValue}>{formattedValue}</span>
					</div>
					<div className={styles.sliderContainer}>
						<Slider
							defaultValue={localValue}
							factoryDefaultValue={100}
							minValue={minValue}
							maxValue={maxValue}
							disabled={disabled}
							onValueChange={handleValueCommit}
							asValueChanges={handleValueChange}
							mini={true}
							value={localValue}
						/>
					</div>
				</div>
			</AriaMenuItem>
		);
	},
);

MenuItemSlider.displayName = 'MenuItemSlider';
