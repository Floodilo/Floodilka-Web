/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import KeybindStore, {type KeybindAction, type KeyCombo} from '~/stores/KeybindStore';

export const KEYBIND_PRESET_VERSION = 1;

export interface KeybindPreset {
	version: number;
	transmitMode?: 'voice_activity' | 'push_to_talk';
	pushToTalkReleaseDelay?: number;
	pushToTalkLatching?: boolean;
	keybinds: Partial<Record<KeybindAction, Array<KeyCombo>>>;
}

export function serializeKeybindPreset(): KeybindPreset {
	const entries: Partial<Record<KeybindAction, Array<KeyCombo>>> = {};
	for (const entry of KeybindStore.getAll()) {
		entries[entry.action] = entry.combos.map((c) => ({...c}));
	}
	return {
		version: KEYBIND_PRESET_VERSION,
		transmitMode: KeybindStore.transmitMode,
		pushToTalkReleaseDelay: KeybindStore.pushToTalkReleaseDelay,
		pushToTalkLatching: KeybindStore.pushToTalkLatching,
		keybinds: entries,
	};
}

export function stringifyKeybindPreset(preset: KeybindPreset): string {
	return JSON.stringify(preset, null, 2);
}

export class KeybindPresetParseError extends Error {}

function isCombo(value: unknown): value is KeyCombo {
	if (!value || typeof value !== 'object') return false;
	const c = value as Record<string, unknown>;
	if ('key' in c && typeof c.key !== 'string') return false;
	if ('code' in c && c.code !== undefined && typeof c.code !== 'string') return false;
	if ('mouseButton' in c && c.mouseButton !== undefined && typeof c.mouseButton !== 'number') return false;
	return typeof c.key === 'string' || typeof c.code === 'string' || typeof c.mouseButton === 'number';
}

export function parseKeybindPreset(raw: string): KeybindPreset {
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch {
		throw new KeybindPresetParseError('Invalid JSON');
	}
	if (!parsed || typeof parsed !== 'object') {
		throw new KeybindPresetParseError('Preset must be an object');
	}
	const p = parsed as Record<string, unknown>;
	if (typeof p.version !== 'number') throw new KeybindPresetParseError('Missing version');
	if (p.version !== KEYBIND_PRESET_VERSION) {
		throw new KeybindPresetParseError(`Unsupported preset version: ${p.version}`);
	}
	const keybinds = p.keybinds;
	if (!keybinds || typeof keybinds !== 'object' || Array.isArray(keybinds)) {
		throw new KeybindPresetParseError('Missing keybinds map');
	}
	const cleanedKeybinds: Partial<Record<KeybindAction, Array<KeyCombo>>> = {};
	for (const [action, value] of Object.entries(keybinds)) {
		if (!Array.isArray(value)) continue;
		const combos = value.filter(isCombo);
		if (combos.length === 0) continue;
		cleanedKeybinds[action as KeybindAction] = combos;
	}
	const result: KeybindPreset = {
		version: KEYBIND_PRESET_VERSION,
		keybinds: cleanedKeybinds,
	};
	if (p.transmitMode === 'voice_activity' || p.transmitMode === 'push_to_talk') {
		result.transmitMode = p.transmitMode;
	}
	if (typeof p.pushToTalkReleaseDelay === 'number') {
		result.pushToTalkReleaseDelay = p.pushToTalkReleaseDelay;
	}
	if (typeof p.pushToTalkLatching === 'boolean') {
		result.pushToTalkLatching = p.pushToTalkLatching;
	}
	return result;
}

export function applyKeybindPreset(preset: KeybindPreset): void {
	for (const [action, combos] of Object.entries(preset.keybinds)) {
		if (!combos) continue;
		KeybindStore.setKeybinds(action as KeybindAction, combos);
	}
	if (preset.transmitMode) {
		KeybindStore.setTransmitMode(preset.transmitMode);
	}
	if (typeof preset.pushToTalkReleaseDelay === 'number') {
		KeybindStore.setPushToTalkReleaseDelay(preset.pushToTalkReleaseDelay);
	}
	if (typeof preset.pushToTalkLatching === 'boolean') {
		KeybindStore.setPushToTalkLatching(preset.pushToTalkLatching);
	}
}
