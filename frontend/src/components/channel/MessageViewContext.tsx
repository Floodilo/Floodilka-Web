/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import type {MessagePreviewContext} from '~/Constants';
import type {ChannelRecord} from '~/records/ChannelRecord';
import type {MessageRecord} from '~/records/MessageRecord';

export interface MessagePreviewOverrides {
	usernameColor?: string;
	displayName?: string;
}

export interface MessageViewContextValue {
	channel: ChannelRecord;
	message: MessageRecord;
	shouldGroup: boolean;
	isHovering: boolean;
	previewContext?: keyof typeof MessagePreviewContext;
	previewOverrides?: MessagePreviewOverrides;
	handleDelete: (bypassConfirm?: boolean) => void;
	onPopoutToggle?: (isOpen: boolean) => void;
}

const MessageViewContext = React.createContext<MessageViewContextValue | null>(null);

export const MessageViewContextProvider = MessageViewContext.Provider;

export const useMessageViewContext = (): MessageViewContextValue => {
	const context = React.useContext(MessageViewContext);
	if (!context) {
		throw new Error('useMessageViewContext must be used within a MessageViewContextProvider');
	}
	return context;
};

export const useMaybeMessageViewContext = (): MessageViewContextValue | null => React.useContext(MessageViewContext);
