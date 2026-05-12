/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {autorun} from 'mobx';
import React from 'react';
import * as ContextMenuActionCreators from '~/actions/ContextMenuActionCreators';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import * as PremiumActionCreators from '~/actions/PremiumActionCreators';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import {ChannelTypes} from '~/Constants';
import {MenuItem} from '~/components/uikit/ContextMenu/MenuItem';
import {Logger} from '~/lib/Logger';
import {Routes} from '~/Routes';
import type {GuildRecord} from '~/records/GuildRecord';
import ChannelStore from '~/stores/ChannelStore';
import ContextMenuStore from '~/stores/ContextMenuStore';
import * as RouterUtils from '~/utils/RouterUtils';

const logger = new Logger('useCommunityActions');

export const useCommunityActions = (operatorGuild: GuildRecord | undefined) => {
	const {t} = useLingui();
	const [loadingRejoinCommunity, setLoadingRejoinCommunity] = React.useState(false);
	const [isCommunityMenuOpen, setIsCommunityMenuOpen] = React.useState(false);
	const communityButtonRef = React.useRef<HTMLButtonElement | null>(null);

	const hasOperatorGuild = Boolean(operatorGuild);

	const getFirstViewableChannel = React.useCallback((guildId: string) => {
		const channels = ChannelStore.getGuildChannels(guildId);
		return channels.find((channel) => channel.type === ChannelTypes.GUILD_TEXT);
	}, []);

	const handleRejoinOperatorGuild = React.useCallback(async () => {
		setLoadingRejoinCommunity(true);
		try {
			await PremiumActionCreators.rejoinOperatorGuild();
			if (operatorGuild) {
				const firstChannel = getFirstViewableChannel(operatorGuild.id);
				ModalActionCreators.popAll();
				RouterUtils.transitionTo(Routes.guildChannel(operatorGuild.id, firstChannel?.id));
			}
		} catch (error) {
			logger.error('Failed to rejoin operator guild', error);
			ToastActionCreators.error(t`Failed to rejoin the Operators community. Please try again.`);
		} finally {
			setLoadingRejoinCommunity(false);
		}
	}, [operatorGuild, getFirstViewableChannel, t]);

	const handleCommunityButtonPointerDown = React.useCallback((event: React.PointerEvent) => {
		const contextMenu = ContextMenuStore.contextMenu;
		const isOpen = !!contextMenu && contextMenu.target.target === communityButtonRef.current;
		if (isOpen) {
			event.stopPropagation();
			event.preventDefault();
			ContextMenuActionCreators.close();
		}
	}, []);

	const handleCommunityButtonClick = React.useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			const contextMenu = ContextMenuStore.contextMenu;
			const isOpen = !!contextMenu && contextMenu.target.target === event.currentTarget;
			if (isOpen) {
				return;
			}
			ContextMenuActionCreators.openFromEvent(event, () => (
				<MenuItem
					onClick={() => {
						ContextMenuActionCreators.close();
						if (hasOperatorGuild && operatorGuild) {
							const firstChannel = getFirstViewableChannel(operatorGuild.id);
							ModalActionCreators.popAll();
							RouterUtils.transitionTo(Routes.guildChannel(operatorGuild.id, firstChannel?.id));
						} else {
							handleRejoinOperatorGuild();
						}
					}}
				>
					{hasOperatorGuild ? t`Open Operators Community` : t`Join Operators Community`}
				</MenuItem>
			));
		},
		[hasOperatorGuild, operatorGuild, getFirstViewableChannel, handleRejoinOperatorGuild, t],
	);

	React.useEffect(() => {
		const handleContextMenuChange = () => {
			const contextMenu = ContextMenuStore.contextMenu;
			const isOpen =
				!!contextMenu && !!communityButtonRef.current && contextMenu.target.target === communityButtonRef.current;
			setIsCommunityMenuOpen(isOpen);
		};
		const disposer = autorun(handleContextMenuChange);
		return () => disposer();
	}, []);

	return {
		loadingRejoinCommunity,
		isCommunityMenuOpen,
		communityButtonRef,
		handleCommunityButtonPointerDown,
		handleCommunityButtonClick,
	};
};
