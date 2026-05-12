/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {msg} from '@lingui/core/macro';
import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {UsernameChangeModal} from '~/components/modals/UsernameChangeModal';
import {Button} from '~/components/uikit/Button/Button';
import {Tooltip} from '~/components/uikit/Tooltip/Tooltip';
import styles from './UsernameSection.module.css';

interface UsernameSectionProps {
	isClaimed: boolean;
	hasPremium: boolean;
}

export const UsernameSection = observer(({isClaimed}: UsernameSectionProps) => {
	const {t} = useLingui();

	return (
		<div>
			<div className={styles.label}>
				<Trans>Username</Trans>
			</div>

			<div className={styles.actions}>
				{!isClaimed ? (
					<Tooltip text={t(msg`Claim your account to change your username`)}>
						<div>
							<Button variant="primary" small disabled>
								<Trans>Change Username</Trans>
							</Button>
						</div>
					</Tooltip>
				) : (
					<Button
						variant="primary"
						small
						onClick={() => ModalActionCreators.push(modal(() => <UsernameChangeModal />))}
					>
						<Trans>Change Username</Trans>
					</Button>
				)}
			</div>

			<div className={styles.description}>
				<Trans>Your username is how others identify you.</Trans>
			</div>
		</div>
	);
});
