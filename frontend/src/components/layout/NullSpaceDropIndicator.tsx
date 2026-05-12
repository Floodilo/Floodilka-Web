/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import React from 'react';
import type {ConnectableElement} from 'react-dnd';
import {useDrop} from 'react-dnd';
import styles from './NullSpaceDropIndicator.module.css';
import {DND_TYPES, type DragItem, type DropResult} from './types/dnd';

interface NullSpaceDropIndicatorProps {
	isDraggingAnything: boolean;
	onChannelDrop?: (item: DragItem, result: DropResult) => void;
	variant?: 'top' | 'bottom';
}

export const NullSpaceDropIndicator = observer(
	({isDraggingAnything, onChannelDrop, variant = 'top'}: NullSpaceDropIndicatorProps) => {
		const [{isOver, canDrop}, dropRef] = useDrop(
			() => ({
				accept: [DND_TYPES.CHANNEL, DND_TYPES.CATEGORY],
				drop: (item: DragItem): DropResult => {
					const result: DropResult =
						variant === 'top'
							? {targetId: 'null-space', position: 'before', targetParentId: null}
							: {targetId: 'trailing-space', position: 'after', targetParentId: null};
					onChannelDrop?.(item, result);
					return result;
				},
				collect: (monitor) => ({
					isOver: monitor.isOver({shallow: true}),
					canDrop: monitor.canDrop(),
				}),
			}),
			[onChannelDrop, variant],
		);

		const dropConnectorRef = React.useCallback(
			(node: ConnectableElement | null) => {
				dropRef(node);
			},
			[dropRef],
		);

		return (
			<div
				ref={dropConnectorRef}
				className={clsx(styles.container, isDraggingAnything ? styles.containerDragging : styles.containerNotDragging)}
			>
				<div
					className={clsx(
						styles.indicator,
						isOver && canDrop && isDraggingAnything ? styles.indicatorVisible : styles.indicatorHidden,
					)}
				/>
			</div>
		);
	},
);
