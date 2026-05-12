/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {ListPlusIcon, SnowflakeIcon} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as TextCopyActionCreators from '~/actions/TextCopyActionCreators';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import UserNoteStore from '~/stores/UserNoteStore';
import styles from './ProfileCardActions.module.css';

interface ProfileCardActionsProps {
	userId: string;
	isHovering: boolean;
	onNoteClick: () => void;
}

export const ProfileCardActions: React.FC<ProfileCardActionsProps> = observer(({userId, isHovering, onNoteClick}) => {
	const {t, i18n} = useLingui();
	const userNote = UserNoteStore.getUserNote(userId);
	const noteButtonRef = React.useRef<HTMLButtonElement>(null);
	const copyIdButtonRef = React.useRef<HTMLButtonElement>(null);

	return (
		<>
			<div className={clsx(styles.noteButtonContainer, isHovering && styles.noteButtonContainerVisible)}>
				<FocusRing offset={-2} focusTarget={noteButtonRef} ringTarget={noteButtonRef}>
					<Tooltip
						text={userNote ? () => <div className={styles.noteTooltipContent}>{userNote}</div> : t`Add Note`}
						maxWidth="none"
					>
						<button ref={noteButtonRef} type="button" onClick={onNoteClick} className={styles.noteButton}>
							<ListPlusIcon className={clsx(styles.iconMedium, styles.noteIconWrapper)} />
						</button>
					</Tooltip>
				</FocusRing>
			</div>

			<div className={clsx(styles.copyIdButtonContainer, isHovering && styles.copyIdButtonContainerVisible)}>
				<FocusRing offset={-2} focusTarget={copyIdButtonRef} ringTarget={copyIdButtonRef}>
					<Tooltip text={t`Copy User ID`} maxWidth="none">
						<button
							ref={copyIdButtonRef}
							type="button"
							onClick={() => TextCopyActionCreators.copy(i18n, userId)}
							className={styles.copyIdButton}
						>
							<SnowflakeIcon weight="bold" className={clsx(styles.iconMedium, styles.copyIdIconWrapper)} />
						</button>
					</Tooltip>
				</FocusRing>
			</div>
		</>
	);
});
