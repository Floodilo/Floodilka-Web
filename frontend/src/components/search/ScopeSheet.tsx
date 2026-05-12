/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import type {IconProps} from '@phosphor-icons/react';
import {
	ChatCenteredDotsIcon,
	CheckIcon,
	EnvelopeSimpleIcon,
	GlobeIcon,
	HashIcon,
	UsersIcon,
} from '@phosphor-icons/react';
import {clsx} from 'clsx';
import type React from 'react';
import type {ScopeValueOption} from '~/components/channel/searchScopeOptions';
import {BottomSheet} from '~/components/uikit/BottomSheet/BottomSheet';
import {Scroller} from '~/components/uikit/Scroller';
import type {MessageSearchScope} from '~/utils/SearchUtils';
import styles from './ScopeSheet.module.css';

const SCOPE_ICON_COMPONENTS: Record<MessageSearchScope, React.ComponentType<IconProps>> = {
	current: HashIcon,
	all_dms: EnvelopeSimpleIcon,
	open_dms: ChatCenteredDotsIcon,
	all_guilds: GlobeIcon,
	all: UsersIcon,
	open_dms_and_all_guilds: UsersIcon,
};

interface ScopeSheetProps {
	isOpen: boolean;
	onClose: () => void;
	selectedScope: MessageSearchScope;
	scopeOptions: Array<ScopeValueOption>;
	onScopeChange: (scope: MessageSearchScope) => void;
}

export const ScopeSheet: React.FC<ScopeSheetProps> = ({
	isOpen,
	onClose,
	selectedScope,
	scopeOptions,
	onScopeChange,
}) => {
	const {t} = useLingui();
	const handleSelect = (scope: MessageSearchScope) => {
		onScopeChange(scope);
		onClose();
	};

	return (
		<BottomSheet
			isOpen={isOpen}
			onClose={onClose}
			snapPoints={[0, 1]}
			initialSnap={1}
			title={t`Search in`}
			disablePadding
		>
			<div className={styles.container}>
				<Scroller className={styles.scroller} fade={false}>
					<div className={styles.optionsContainer}>
						{scopeOptions.map((option) => {
							const isSelected = selectedScope === option.value;
							const Icon = SCOPE_ICON_COMPONENTS[option.value] ?? HashIcon;
							return (
								<button
									key={option.value}
									type="button"
									className={clsx(styles.option, isSelected && styles.optionSelected)}
									onClick={() => handleSelect(option.value)}
								>
									<div className={styles.optionLeft}>
										<Icon
											size={22}
											className={clsx(styles.optionIcon, isSelected && styles.optionIconSelected)}
											weight="regular"
										/>
										<div className={styles.optionText}>
											<span className={clsx(styles.optionLabel, isSelected && styles.optionLabelSelected)}>
												{option.label}
											</span>
											{option.description && <span className={styles.optionDescription}>{option.description}</span>}
										</div>
									</div>
									{isSelected && <CheckIcon size={20} className={styles.checkIcon} weight="bold" />}
								</button>
							);
						})}
					</div>
				</Scroller>
			</div>
		</BottomSheet>
	);
};
