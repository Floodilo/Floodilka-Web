/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import * as UserSettingsActionCreators from '~/actions/UserSettingsActionCreators';
import {Switch} from '~/components/form/Switch';
import * as Modal from '~/components/modals/Modal';
import {Button} from '~/components/uikit/Button/Button';
import GuildStore from '~/stores/GuildStore';
import UserSettingsStore from '~/stores/UserSettingsStore';
import styles from './GuildPrivacySettingsModal.module.css';

export const GuildPrivacySettingsModal = observer(function GuildPrivacySettingsModal({guildId}: {guildId: string}) {
	const {t} = useLingui();
	const guild = GuildStore.getGuild(guildId);
	const restrictedGuilds = UserSettingsStore.restrictedGuilds;

	if (!guild) return null;

	const isDMsAllowed = !restrictedGuilds.includes(guildId);

	const handleToggleDMs = async (value: boolean) => {
		let newRestrictedGuilds: Array<string>;

		if (value) {
			newRestrictedGuilds = restrictedGuilds.filter((id) => id !== guildId);
		} else {
			newRestrictedGuilds = [...restrictedGuilds, guildId];
		}

		await UserSettingsActionCreators.update({
			restrictedGuilds: newRestrictedGuilds,
		});
	};

	return (
		<Modal.Root size="small" centered>
			<Modal.Header title={t`Privacy Settings`} />
			<Modal.Content>
				<div className={styles.container}>
					<Switch
						label={t`Direct Messages`}
						description={t`Allow direct messages from other members in this community`}
						value={isDMsAllowed}
						onChange={handleToggleDMs}
					/>
				</div>
			</Modal.Content>
			<Modal.Footer>
				<Button onClick={() => ModalActionCreators.pop()}>{t`Done`}</Button>
			</Modal.Footer>
		</Modal.Root>
	);
});
