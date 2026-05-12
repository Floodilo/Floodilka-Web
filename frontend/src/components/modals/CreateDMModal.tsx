/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {MagnifyingGlassIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {FriendSelector} from '~/components/common/FriendSelector';
import {Input} from '~/components/form/Input';
import {DuplicateGroupConfirmModal} from '~/components/modals/DuplicateGroupConfirmModal';
import * as Modal from '~/components/modals/Modal';
import selectorStyles from '~/components/modals/shared/SelectorModalStyles.module.css';
import {Button} from '~/components/uikit/Button/Button';
import {type CreateDMModalProps, useCreateDMModalLogic} from '~/utils/modals/CreateDMModalUtils';

export const CreateDMModal = observer((props: CreateDMModalProps) => {
	const {t} = useLingui();
	const modalLogic = useCreateDMModalLogic(props);

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
		}
	}, [modalLogic]);

	return (
		<Modal.Root size="small" centered>
			<Modal.Header title={t`Select Friends`}>
				<p className={selectorStyles.subtitle}>
					{modalLogic.selectedUserIds.length === 0 ? (
						<Trans>You can add up to {modalLogic.maxSelections} friends</Trans>
					) : (
						<Trans>
							You can add {Math.max(0, modalLogic.maxSelections - modalLogic.selectedUserIds.length)} more friends
						</Trans>
					)}
				</p>
				<div className={selectorStyles.headerSearch}>
					<Input
						value={modalLogic.searchQuery}
						onChange={(e) => modalLogic.setSearchQuery(e.target.value)}
						placeholder={t`Search friends`}
						leftIcon={<MagnifyingGlassIcon weight="bold" className={selectorStyles.searchIcon} />}
						className={selectorStyles.headerSearchInput}
					/>
				</div>
			</Modal.Header>
			<Modal.Content className={selectorStyles.selectorContent}>
				<FriendSelector
					selectedUserIds={modalLogic.selectedUserIds}
					onToggle={modalLogic.handleToggle}
					maxSelections={modalLogic.maxSelections}
					searchQuery={modalLogic.searchQuery}
					onSearchQueryChange={modalLogic.setSearchQuery}
					showSearchInput={false}
					stickyUserIds={props.initialSelectedUserIds}
				/>
			</Modal.Content>
			<Modal.Footer className={selectorStyles.footer}>
				<div className={selectorStyles.actionRow}>
					<Button variant="secondary" onClick={() => ModalActionCreators.pop()} className={selectorStyles.actionButton}>
						<Trans>Cancel</Trans>
					</Button>
					<Button
						onClick={handleCreate}
						disabled={modalLogic.isCreating}
						submitting={modalLogic.isCreating}
						className={selectorStyles.actionButton}
					>
						{modalLogic.buttonText}
					</Button>
				</div>
			</Modal.Footer>
		</Modal.Root>
	);
});
