/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {ChannelDebugModal} from '~/components/debug/ChannelDebugModal';
import {GuildDebugModal} from '~/components/debug/GuildDebugModal';
import {GuildMemberDebugModal} from '~/components/debug/GuildMemberDebugModal';
import {UserDebugModal} from '~/components/debug/UserDebugModal';
import type {ChannelRecord} from '~/records/ChannelRecord';
import type {GuildMemberRecord} from '~/records/GuildMemberRecord';
import type {GuildRecord} from '~/records/GuildRecord';
import type {UserRecord} from '~/records/UserRecord';
import {DebugIcon} from '../ContextMenuIcons';
import {MenuItem} from '../MenuItem';

interface BaseDebugMenuItemProps {
	onClose: () => void;
}

type DebugUserMenuItemProps = BaseDebugMenuItemProps & {
	user: UserRecord;
};

export const DebugUserMenuItem: React.FC<DebugUserMenuItemProps> = observer(({user, onClose}) => {
	const {t} = useLingui();
	const handleDebug = React.useCallback(() => {
		ModalActionCreators.push(modal(() => <UserDebugModal title={t`User Debug`} user={user} />));
		onClose();
	}, [user, onClose]);

	return (
		<MenuItem icon={<DebugIcon />} onClick={handleDebug}>
			{t`Debug User`}
		</MenuItem>
	);
});

type DebugChannelMenuItemProps = BaseDebugMenuItemProps & {
	channel: ChannelRecord;
};

export const DebugChannelMenuItem: React.FC<DebugChannelMenuItemProps> = observer(({channel, onClose}) => {
	const {t} = useLingui();
	const handleDebug = React.useCallback(() => {
		ModalActionCreators.push(modal(() => <ChannelDebugModal title={t`Channel Debug`} channel={channel} />));
		onClose();
	}, [channel, onClose]);

	return (
		<MenuItem icon={<DebugIcon />} onClick={handleDebug}>
			{t`Debug Channel`}
		</MenuItem>
	);
});

type DebugGuildMenuItemProps = BaseDebugMenuItemProps & {
	guild: GuildRecord;
};

export const DebugGuildMenuItem: React.FC<DebugGuildMenuItemProps> = observer(({guild, onClose}) => {
	const {t} = useLingui();
	const handleDebug = React.useCallback(() => {
		ModalActionCreators.push(modal(() => <GuildDebugModal title={t`Community Debug`} guild={guild} />));
		onClose();
	}, [guild, onClose]);

	return (
		<MenuItem icon={<DebugIcon />} onClick={handleDebug}>
			{t`Debug Guild`}
		</MenuItem>
	);
});

type DebugGuildMemberMenuItemProps = BaseDebugMenuItemProps & {
	member: GuildMemberRecord;
};

export const DebugGuildMemberMenuItem: React.FC<DebugGuildMemberMenuItemProps> = observer(({member, onClose}) => {
	const {t} = useLingui();
	const handleDebug = React.useCallback(() => {
		ModalActionCreators.push(modal(() => <GuildMemberDebugModal title={t`Community Member Debug`} member={member} />));
		onClose();
	}, [member, onClose]);

	return (
		<MenuItem icon={<DebugIcon />} onClick={handleDebug}>
			{t`Debug Member`}
		</MenuItem>
	);
});
