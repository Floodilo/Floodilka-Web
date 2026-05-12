/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {WarningCircleIcon} from '@phosphor-icons/react';
import previewStyles from '~/components/shared/MessagePreview.module.css';
import FocusRing from '~/components/uikit/FocusRing/FocusRing';

interface SavedMessageMissingCardProps {
	entryId: string;
	onRemove: () => void;
}

export const SavedMessageMissingCard = ({entryId, onRemove}: SavedMessageMissingCardProps) => {
	const {t} = useLingui();
	return (
		<div key={`lost-${entryId}`} className={previewStyles.previewCard}>
			<div className={previewStyles.lostMessageInner}>
				<WarningCircleIcon className={previewStyles.lostMessageIcon} weight="duotone" />
				<p className={previewStyles.lostMessageText}>{t`You lost access to this saved message. Remove?`}</p>
			</div>

			<div className={previewStyles.actionButtons}>
				<FocusRing offset={-2}>
					<button type="button" className={previewStyles.actionButton} onClick={onRemove}>
						{t`Remove`}
					</button>
				</FocusRing>
			</div>
		</div>
	);
};
