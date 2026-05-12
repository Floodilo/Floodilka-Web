/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

export interface CustomStatus {
	text: string | null;
	expiresAt: string | null;
	emojiId: string | null;
	emojiName: string | null;
	emojiAnimated?: boolean | null;
}

export interface GatewayCustomStatusPayload {
	text?: string | null;
	expires_at?: string | null;
	emoji_id?: string | null;
	emoji_name?: string | null;
	emoji_animated?: boolean | null;
}

export const CUSTOM_STATUS_TEXT_LIMIT = 128;

export const isCustomStatusExpired = (status: CustomStatus | null, referenceTime = Date.now()): boolean => {
	if (!status?.expiresAt) {
		return false;
	}

	const expiresAt = Date.parse(status.expiresAt);
	if (Number.isNaN(expiresAt)) {
		return false;
	}

	return expiresAt <= referenceTime;
};

function normalizeText(text: string | null | undefined): string | null {
	const trimmed = text?.trim() ?? null;
	if (!trimmed) {
		return null;
	}
	return trimmed.slice(0, CUSTOM_STATUS_TEXT_LIMIT);
}

function normalizeEmojiName(name: string | null | undefined): string | null {
	const trimmed = name?.trim() ?? null;
	return trimmed || null;
}

export const normalizeCustomStatus = (status: CustomStatus | null | undefined): CustomStatus | null => {
	if (!status) {
		return null;
	}

	const text = normalizeText(status.text);
	const emojiId = status.emojiId?.trim() ?? null;
	const emojiName = normalizeEmojiName(status.emojiName);
	const expiresAt = status.expiresAt ?? null;

	if (!text && !emojiId && !emojiName) {
		return null;
	}

	const normalized: CustomStatus = {
		text,
		expiresAt,
		emojiId,
		emojiName,
		emojiAnimated: status.emojiAnimated ?? null,
	};

	if (isCustomStatusExpired(normalized)) {
		return null;
	}

	return normalized;
};

export const toGatewayCustomStatus = (status: CustomStatus | null | undefined): GatewayCustomStatusPayload | null => {
	if (!status) {
		return null;
	}

	return {
		text: status.text,
		expires_at: status.expiresAt,
		emoji_id: status.emojiId,
		emoji_name: status.emojiName,
		emoji_animated: status.emojiAnimated ?? undefined,
	};
};

export const fromGatewayCustomStatus = (
	payload: GatewayCustomStatusPayload | null | undefined,
): CustomStatus | null => {
	if (!payload) {
		return null;
	}

	const customStatus: CustomStatus = {
		text: payload.text ?? null,
		expiresAt: payload.expires_at ?? null,
		emojiId: payload.emoji_id ?? null,
		emojiName: payload.emoji_name ?? null,
		emojiAnimated: payload.emoji_animated ?? null,
	};

	return normalizeCustomStatus(customStatus);
};

export const customStatusToKey = (status: CustomStatus | null | undefined): string => {
	if (!status) {
		return '';
	}

	return `${status.text ?? ''}|${status.emojiId ?? ''}|${status.emojiName ?? ''}|${status.emojiAnimated ?? ''}|${status.expiresAt ?? ''}`;
};

export const getCustomStatusText = (status: CustomStatus | null | undefined): string | null => {
	const normalized = status?.text ? status.text.trim() : null;
	return normalized || null;
};
