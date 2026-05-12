/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import type React from 'react';
import * as Sheet from '~/components/uikit/Sheet/Sheet';

interface BottomSheetProps {
	isOpen: boolean;
	onClose: () => void;
	children: React.ReactNode;
	title?: string;
	initialSnap?: number;
	snapPoints?: Array<number>;
	disablePadding?: boolean;
	disableDefaultHeader?: boolean;
	zIndex?: number;
	showHandle?: boolean;
	showCloseButton?: boolean;
	surface?: 'primary' | 'secondary' | 'tertiary';
	headerSlot?: React.ReactNode;
	leadingAction?: React.ReactNode;
	trailingAction?: React.ReactNode;
	containerClassName?: string;
	contentClassName?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = observer(
	({
		isOpen,
		onClose,
		children,
		title,
		initialSnap = 1,
		snapPoints = [0, 0.5, 0.8, 1],
		disablePadding = false,
		disableDefaultHeader = false,
		zIndex,
		showHandle = true,
		showCloseButton = true,
		surface = 'secondary',
		headerSlot,
		leadingAction,
		trailingAction,
		containerClassName,
		contentClassName,
	}) => {
		const shouldRenderDefaultHeader =
			!disableDefaultHeader && (!!title || !!leadingAction || !!trailingAction || showCloseButton);

		const renderTrailingContent = () => {
			if (!shouldRenderDefaultHeader) return undefined;
			if (trailingAction && showCloseButton) {
				return (
					<>
						{trailingAction}
						<Sheet.CloseButton onClick={onClose} />
					</>
				);
			}
			if (showCloseButton) {
				return <Sheet.CloseButton onClick={onClose} />;
			}
			return trailingAction;
		};

		return (
			<Sheet.Root
				isOpen={isOpen}
				onClose={onClose}
				snapPoints={snapPoints}
				initialSnap={initialSnap}
				surface={surface}
				zIndex={zIndex}
				className={containerClassName}
			>
				{showHandle && <Sheet.Handle />}
				{shouldRenderDefaultHeader && (
					<Sheet.Header
						leading={leadingAction}
						trailing={renderTrailingContent()}
						safeAreaTop={!showHandle}
						after={headerSlot}
					>
						{title && <Sheet.Title>{title}</Sheet.Title>}
					</Sheet.Header>
				)}
				{!shouldRenderDefaultHeader && headerSlot}
				{disablePadding ? children : <Sheet.Content className={contentClassName}>{children}</Sheet.Content>}
			</Sheet.Root>
		);
	},
);
