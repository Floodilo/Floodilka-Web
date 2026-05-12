/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import React from 'react';
import * as ToastActionCreators from '~/actions/ToastActionCreators';
import * as UnsavedChangesActionCreators from '~/actions/UnsavedChangesActionCreators';
import * as WebhookActionCreators from '~/actions/WebhookActionCreators';
import type {WebhookRecord} from '~/records/WebhookRecord';

interface WebhookUpdate {
	id: string;
	name?: string;
	avatar?: string | null;
	channelId?: string;
}

interface UseWebhookUpdatesArgs {
	tabId: string;
	canManage: boolean;
	originals: ReadonlyArray<WebhookRecord> | undefined;
}

export function useWebhookUpdates({tabId, canManage, originals}: UseWebhookUpdatesArgs) {
	const [updates, setUpdates] = React.useState<Map<string, WebhookUpdate>>(new Map());
	const [isSaving, setIsSaving] = React.useState(false);
	const [formVersion, setFormVersion] = React.useState(0);
	const originalsRef = React.useRef(originals);
	originalsRef.current = originals;

	const hasUnsavedChanges = updates.size > 0;

	React.useEffect(() => {
		UnsavedChangesActionCreators.setUnsavedChanges(tabId, hasUnsavedChanges);
	}, [tabId, hasUnsavedChanges]);

	const reset = React.useCallback(() => {
		setUpdates(new Map());
		setFormVersion((v) => v + 1);
	}, []);

	const save = React.useCallback(async () => {
		if (!canManage) return;

		try {
			setIsSaving(true);

			const moves = Array.from(updates.values())
				.filter((u) => u.channelId !== undefined)
				.map((u) => ({webhookId: u.id, newChannelId: u.channelId!}));

			for (const m of moves) {
				await WebhookActionCreators.moveWebhook(m.webhookId, m.newChannelId);
			}

			const basics = Array.from(updates.values())
				.filter((u) => u.name !== undefined || u.avatar !== undefined)
				.map((u) => ({webhookId: u.id, name: u.name, avatar: u.avatar}));

			if (basics.length > 0) {
				await WebhookActionCreators.updateWebhooks(basics);
			}

			setUpdates(new Map());
			setFormVersion((v) => v + 1);
			ToastActionCreators.createToast({type: 'success', children: <Trans>Webhooks updated</Trans>});
		} catch (error) {
			console.error('Failed to update webhooks:', error);
			ToastActionCreators.createToast({type: 'error', children: <Trans>Failed to update webhooks</Trans>});
		} finally {
			setIsSaving(false);
		}
	}, [canManage, updates]);

	React.useEffect(() => {
		UnsavedChangesActionCreators.setTabData(tabId, {
			onReset: reset,
			onSave: save,
			isSubmitting: isSaving,
		});
	}, [tabId, reset, save, isSaving]);

	const handleUpdate = React.useCallback((webhookId: string, patch: Partial<WebhookUpdate>) => {
		setUpdates((prev) => {
			const next = new Map(prev);
			const existing = next.get(webhookId) || {id: webhookId};
			const merged: WebhookUpdate = {...existing, ...patch};

			const original = originalsRef.current?.find((w) => w.id === webhookId);
			if (!original) {
				next.set(webhookId, merged);
				return next;
			}

			const changed =
				(merged.name !== undefined && merged.name !== original.name) ||
				(merged.avatar !== undefined && merged.avatar !== original.avatar) ||
				(merged.channelId !== undefined && merged.channelId !== original.channelId);

			if (changed) next.set(webhookId, merged);
			else next.delete(webhookId);

			return next;
		});
	}, []);

	return {updates, hasUnsavedChanges, handleUpdate, reset, save, setUpdates, formVersion};
}
