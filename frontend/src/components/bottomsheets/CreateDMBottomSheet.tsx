/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {FriendSelector} from '~/components/common/FriendSelector';
import {DuplicateGroupConfirmModal} from '~/components/modals/DuplicateGroupConfirmModal';
import {BottomSheet} from '~/components/uikit/BottomSheet/BottomSheet';
import {Button} from '~/components/uikit/Button/Button';
import {Scroller} from '~/components/uikit/Scroller';
import {useCreateDMModalLogic} from '~/utils/modals/CreateDMModalUtils';
import styles from './CreateDMBottomSheet.module.css';

interface CreateDMBottomSheetProps {
	isOpen: boolean;
	onClose: () => void;
}

type ScrollContentStyle = React.CSSProperties & {
	'--create-dm-scroll-padding-bottom'?: string;
};

export const CreateDMBottomSheet = observer(({isOpen, onClose}: CreateDMBottomSheetProps) => {
	const {t} = useLingui();
	const modalLogic = useCreateDMModalLogic({autoCloseOnCreate: false, resetKey: isOpen});
	const snapPoints = React.useMemo(() => [0, 1], []);
	const footerRef = React.useRef<HTMLDivElement>(null);
	const [footerHeight, setFooterHeight] = React.useState(0);

	React.useLayoutEffect(() => {
		if (!isOpen) {
			setFooterHeight(0);
			return undefined;
		}

		const element = footerRef.current;
		if (!element) {
			return undefined;
		}

		const updateHeight = () => setFooterHeight(element.offsetHeight);
		updateHeight();

		const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateHeight) : null;
		if (resizeObserver) {
			resizeObserver.observe(element);
		}

		const handleResize = () => updateHeight();
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', handleResize);
		}

		return () => {
			resizeObserver?.disconnect();
			if (typeof window !== 'undefined') {
				window.removeEventListener('resize', handleResize);
			}
		};
	}, [isOpen]);

	const scrollContentStyle = React.useMemo<ScrollContentStyle>(() => {
		if (footerHeight === 0) {
			return {};
		}
		return {'--create-dm-scroll-padding-bottom': `calc(${footerHeight}px + 16px)`};
	}, [footerHeight]);

	const handleCreate = React.useCallback(async () => {
		const result = await modalLogic.handleCreate();
		if (result && result.duplicates.length > 0) {
			ModalActionCreators.push(
				modal(() => (
					<DuplicateGroupConfirmModal
						channels={result.duplicates}
						onConfirm={() => modalLogic.handleCreateChannel(result.selectionSnapshot)}
					/>
				)),
			);
			return;
		}

		onClose();
	}, [modalLogic, onClose]);

	return (
		<BottomSheet isOpen={isOpen} onClose={onClose} snapPoints={snapPoints} title={t`Select Friends`} disablePadding>
			<div className={styles.container}>
				<Scroller className={styles.scroller} fade={false}>
					<div className={styles.content} style={scrollContentStyle}>
						<p className={styles.description}>
							{modalLogic.selectedUserIds.length === 0 ? (
								<Trans>You can add up to {modalLogic.maxSelections} friends</Trans>
							) : (
								<Trans>
									You can add {Math.max(0, modalLogic.maxSelections - modalLogic.selectedUserIds.length)} more friends
								</Trans>
							)}
						</p>
						<div className={styles.friendSelector}>
							<FriendSelector
								selectedUserIds={modalLogic.selectedUserIds}
								onToggle={modalLogic.handleToggle}
								maxSelections={modalLogic.maxSelections}
								searchQuery={modalLogic.searchQuery}
								onSearchQueryChange={modalLogic.setSearchQuery}
							/>
						</div>
					</div>
				</Scroller>

				<div className={styles.footer} ref={footerRef}>
					<Button variant="secondary" className={styles.cancelButton} onClick={onClose}>
						<Trans>Cancel</Trans>
					</Button>
					<Button
						variant="primary"
						className={styles.createButton}
						onClick={handleCreate}
						disabled={modalLogic.isCreating}
						submitting={modalLogic.isCreating}
					>
						{modalLogic.buttonText}
					</Button>
				</div>
			</div>
		</BottomSheet>
	);
});
