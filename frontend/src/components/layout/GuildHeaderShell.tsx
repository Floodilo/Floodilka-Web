/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {LongPressable} from '~/components/LongPressable';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {Popout} from '~/components/uikit/Popout/Popout';
import {useMergeRefs} from '~/hooks/useMergeRefs';
import PopoutStore from '~/stores/PopoutStore';
import {isMobileExperienceEnabled} from '~/utils/mobileExperience';
import styles from './GuildHeader.module.css';

interface GuildHeaderShellProps {
	popoutId: string;
	renderPopout: () => React.ReactNode;
	renderBottomSheet: (props: {isOpen: boolean; onClose: () => void}) => React.ReactNode;
	onContextMenu: (event: React.MouseEvent) => void;
	children: React.ReactNode | ((isOpen: boolean) => React.ReactNode);
	className?: string;
	triggerRef?: React.Ref<HTMLDivElement>;
}

const GuildHeaderTrigger = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
	(props, forwardedRef) => {
		const {children, ...rest} = props;
		const triggerRef = React.useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergeRefs([triggerRef, forwardedRef]);

		return (
			<FocusRing ringClassName={styles.headerFocusRing} focusTarget={triggerRef} ringTarget={triggerRef} offset={0}>
				<div {...rest} ref={mergedRef}>
					{children}
				</div>
			</FocusRing>
		);
	},
);

GuildHeaderTrigger.displayName = 'GuildHeaderTrigger';

export const GuildHeaderShell = observer(
	({
		popoutId,
		renderPopout,
		renderBottomSheet,
		onContextMenu,
		children,
		className,
		triggerRef,
	}: GuildHeaderShellProps) => {
		const {popouts} = PopoutStore;
		const isOpen = popoutId in popouts;
		const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
		const isMobile = isMobileExperienceEnabled();
		const internalRef = React.useRef<HTMLDivElement | null>(null);
		const mergedRef = useMergeRefs([internalRef, triggerRef]);

		const handleOpenBottomSheet = React.useCallback(() => {
			setBottomSheetOpen(true);
		}, []);

		const handleCloseBottomSheet = React.useCallback(() => {
			setBottomSheetOpen(false);
		}, []);

		const handleContextMenuWrapper = React.useCallback(
			(event: React.MouseEvent) => {
				event.preventDefault();
				event.stopPropagation();
				if (isMobile) {
					handleOpenBottomSheet();
				} else {
					onContextMenu(event);
				}
			},
			[isMobile, handleOpenBottomSheet, onContextMenu],
		);

		if (isMobile) {
			return (
				<>
					<FocusRing
						ringClassName={styles.headerFocusRing}
						focusTarget={internalRef}
						ringTarget={internalRef}
						offset={0}
					>
						<LongPressable
							className={className}
							onClick={handleOpenBottomSheet}
							onKeyDown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									handleOpenBottomSheet();
								}
							}}
							onContextMenu={handleContextMenuWrapper}
							onLongPress={handleOpenBottomSheet}
							role="button"
							tabIndex={0}
							ref={mergedRef}
						>
							{typeof children === 'function' ? children(bottomSheetOpen) : children}
						</LongPressable>
					</FocusRing>
					{renderBottomSheet({isOpen: bottomSheetOpen, onClose: handleCloseBottomSheet})}
				</>
			);
		}

		return (
			<Popout uniqueId={popoutId} render={renderPopout} position="bottom">
				<GuildHeaderTrigger
					className={className}
					onContextMenu={handleContextMenuWrapper}
					role="button"
					tabIndex={0}
					ref={mergedRef}
				>
					{typeof children === 'function' ? children(isOpen) : children}
				</GuildHeaderTrigger>
			</Popout>
		);
	},
);
