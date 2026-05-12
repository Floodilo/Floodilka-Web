/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import Favico from 'favico.js';
import {observer} from 'mobx-react-lite';
import type React from 'react';
import {useEffect} from 'react';
import {RelationshipTypes} from '~/Constants';
import {updateDocumentTitleBadge} from '~/hooks/useDocumentTitle';
import {Logger} from '~/lib/Logger';
import GuildReadStateStore from '~/stores/GuildReadStateStore';
import NotificationStore from '~/stores/NotificationStore';
import RelationshipStore from '~/stores/RelationshipStore';
import {getElectronAPI} from '~/utils/NativeUtils';

declare global {
	interface Navigator {
		setAppBadge?: (contents?: number) => Promise<void>;
		clearAppBadge?: () => Promise<void>;
	}
}

const logger = new Logger('AppBadge');

const UNREAD_INDICATOR = -1;
type BadgeValue = number;

let favico: Favico | null = null;

const initFavico = (): Favico | null => {
	if (favico) return favico;

	try {
		favico = new Favico({animation: 'none'});
		return favico;
	} catch (e) {
		logger.warn('Failed to initialize Favico', e);
		return null;
	}
};

const setElectronBadge = (badge: BadgeValue): void => {
	const electronApi = getElectronAPI();
	if (!electronApi) return;

	const electronBadge = badge > 0 ? badge : 0;
	try {
		electronApi.setBadgeCount(electronBadge);
	} catch (e) {
		logger.warn('Failed to set Electron badge', e);
	}
};

const setFaviconBadge = (badge: BadgeValue): void => {
	const fav = initFavico();
	if (!fav) return;

	try {
		if (badge === UNREAD_INDICATOR) {
			fav.badge('•');
		} else {
			fav.badge(badge);
		}
	} catch (e) {
		logger.warn('Failed to set favicon badge', e);
	}
};

const setPwaBadge = (badge: BadgeValue): void => {
	if (!navigator.setAppBadge || !navigator.clearAppBadge) {
		return;
	}

	try {
		if (badge > 0) {
			void navigator.setAppBadge(badge);
		} else if (badge === UNREAD_INDICATOR) {
			void navigator.setAppBadge();
		} else {
			void navigator.clearAppBadge();
		}
	} catch (e) {
		logger.warn('Failed to set PWA badge', e);
	}
};

const setBadge = (badge: BadgeValue): void => {
	setElectronBadge(badge);
	setFaviconBadge(badge);
	setPwaBadge(badge);
};

export const AppBadge: React.FC = observer(() => {
	const relationships = RelationshipStore.getRelationships();
	const unreadMessageBadgeEnabled = NotificationStore.unreadMessageBadgeEnabled;

	const mentionCount = GuildReadStateStore.getTotalMentionCount();
	const hasUnread = GuildReadStateStore.hasAnyUnread;

	const pendingCount = relationships.filter(
		(relationship) => relationship.type === RelationshipTypes.INCOMING_REQUEST,
	).length;

	const totalCount = mentionCount + pendingCount;

	let badge: BadgeValue = 0;
	if (totalCount > 0) {
		badge = totalCount;
	} else if (hasUnread && unreadMessageBadgeEnabled) {
		badge = UNREAD_INDICATOR;
	}

	useEffect(() => {
		setBadge(badge);
	}, [badge]);

	useEffect(() => {
		updateDocumentTitleBadge(totalCount, hasUnread && unreadMessageBadgeEnabled);
	}, [totalCount, hasUnread, unreadMessageBadgeEnabled]);

	useEffect(() => {
		return () => {
			setBadge(0);
			updateDocumentTitleBadge(0, false);
		};
	}, []);

	return null;
});
