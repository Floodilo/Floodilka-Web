/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {ArrowLeftIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as UserNoteActionCreators from '~/actions/UserNoteActionCreators';
import styles from '~/components/modals/NoteEditSheet.module.css';
import {BottomSheet} from '~/components/uikit/BottomSheet/BottomSheet';
import {TextareaAutosize} from '~/lib/TextareaAutosize';

interface NoteEditSheetProps {
	isOpen: boolean;
	onClose: () => void;
	userId: string;
	initialNote: string | null;
}

export const NoteEditSheet: React.FC<NoteEditSheetProps> = observer(({isOpen, onClose, userId, initialNote}) => {
	const {t} = useLingui();
	const userNoteId = React.useId();
	const [note, setNote] = React.useState(initialNote || '');
	const [hasChanges, setHasChanges] = React.useState(false);

	React.useEffect(() => {
		setHasChanges(note !== (initialNote || ''));
	}, [note, initialNote]);

	const handleSave = () => {
		if (hasChanges) {
			UserNoteActionCreators.update(userId, note);
			onClose();
		}
	};

	const saveButton = (
		<button
			type="button"
			onClick={handleSave}
			disabled={!hasChanges}
			className={clsx(styles.saveButton, hasChanges ? styles.saveButtonActive : styles.saveButtonDisabled)}
		>
			<Trans>Save</Trans>
		</button>
	);

	return (
		<BottomSheet
			isOpen={isOpen}
			onClose={onClose}
			snapPoints={[0, 1]}
			initialSnap={1}
			disablePadding={true}
			surface="primary"
			showCloseButton={false}
			leadingAction={
				<button type="button" onClick={onClose} className={styles.backButton}>
					<ArrowLeftIcon className={styles.backIcon} weight="bold" />
				</button>
			}
			title={t`Edit Note`}
			trailingAction={saveButton}
		>
			<div className={styles.container}>
				<div className={styles.content}>
					<label htmlFor={userNoteId} className={styles.label}>
						<Trans>Note (only visible to you)</Trans>
					</label>
					<TextareaAutosize
						id={userNoteId}
						className={styles.textarea}
						placeholder={t`Tap to add a note`}
						value={note}
						onChange={(e) => setNote(e.target.value)}
						minRows={6}
						maxRows={12}
						maxLength={256}
					/>
				</div>
			</div>
		</BottomSheet>
	);
});
