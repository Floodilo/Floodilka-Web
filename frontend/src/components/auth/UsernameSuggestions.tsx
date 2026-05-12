/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import styles from './UsernameSuggestions.module.css';

interface UsernameSuggestionsProps {
	suggestions: Array<string>;
	onSelect: (username: string) => void;
}

export const UsernameSuggestions = observer(function UsernameSuggestions({
	suggestions,
	onSelect,
}: UsernameSuggestionsProps) {
	if (suggestions.length === 0) {
		return null;
	}

	return (
		<div className={styles.container}>
			<p className={styles.label}>
				<Trans>Suggested usernames:</Trans>
			</p>
			<div className={styles.suggestionsList}>
				{suggestions.map((suggestion, index) => (
					<button
						key={suggestion}
						type="button"
						onClick={() => onSelect(suggestion)}
						className={styles.suggestionButton}
						style={{
							animationDelay: `${index * 50}ms`,
						}}
					>
						{suggestion}
					</button>
				))}
			</div>
		</div>
	);
});
