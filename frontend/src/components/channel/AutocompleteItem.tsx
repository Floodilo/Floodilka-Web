/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';

import styles from './AutocompleteItem.module.css';

export const AutocompleteItem = observer(
	({
		icon,
		name,
		description,
		isKeyboardSelected,
		isHovered,
		onSelect,
		onMouseEnter,
		onMouseLeave,
		innerRef,
		...props
	}: {
		icon?: React.ReactNode;
		name: React.ReactNode;
		description?: string;
		isKeyboardSelected: boolean;
		isHovered: boolean;
		onSelect: () => void;
		onMouseEnter: () => void;
		onMouseLeave: () => void;
		innerRef?: React.Ref<HTMLButtonElement>;
	} & React.HTMLAttributes<HTMLButtonElement>) => {
		const isActive = isKeyboardSelected || isHovered;
		return (
			<button
				type="button"
				className={styles.button}
				onClick={onSelect}
				onPointerEnter={onMouseEnter}
				onPointerLeave={onMouseLeave}
				ref={innerRef}
				{...props}
			>
				<div className={`${styles.container} ${isActive ? styles.selected : ''}`}>
					<div className={styles.content}>
						{icon && <div className={styles.icon}>{icon}</div>}
						<div className={styles.nameWrapper}>
							<div className={styles.name}>{name}</div>
						</div>
						{description && (
							<div className={styles.description}>
								<span>{description}</span>
							</div>
						)}
					</div>
				</div>
			</button>
		);
	},
);
