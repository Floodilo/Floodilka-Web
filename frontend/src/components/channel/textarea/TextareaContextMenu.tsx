/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {
	ArrowClockwiseIcon,
	ArrowCounterClockwiseIcon,
	ClipboardTextIcon,
	CopyIcon,
	ScissorsIcon,
	SelectionIcon,
} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import {MenuGroup} from '~/components/uikit/ContextMenu/MenuGroup';
import {MenuItem} from '~/components/uikit/ContextMenu/MenuItem';
import {MenuItemCheckbox} from '~/components/uikit/ContextMenu/MenuItemCheckbox';
import SpellcheckStore from '~/stores/SpellcheckStore';
import {getElectronAPI, isElectron} from '~/utils/NativeUtils';

interface TextareaContextMenuEditFlags {
	canUndo: boolean;
	canRedo: boolean;
	canCut: boolean;
	canCopy: boolean;
	canPaste: boolean;
	canSelectAll: boolean;
}

interface TextareaContextMenuProps {
	misspelledWord?: string;
	suggestions?: Array<string>;
	editFlags?: TextareaContextMenuEditFlags;
	onClose: () => void;
}

export const TextareaContextMenu = observer(
	({misspelledWord, suggestions = [], editFlags, onClose}: TextareaContextMenuProps) => {
		const {t} = useLingui();
		const electronAPI = isElectron() ? getElectronAPI() : null;
		const showSpellMenu = isElectron() && (electronAPI?.platform === 'darwin' || electronAPI?.platform === 'win32');

		const handleReplaceMisspelling = async (suggestion: string) => {
			if (electronAPI) {
				await electronAPI.spellcheckReplaceMisspelling(suggestion);
			}
			onClose();
		};

		const handleAddToDictionary = async () => {
			if (!misspelledWord || !electronAPI) return;
			await electronAPI.spellcheckAddWordToDictionary(misspelledWord);
			onClose();
		};

		const execCommand = (command: string) => {
			document.execCommand(command);
			onClose();
		};

		const handleToggleSpellcheck = (checked: boolean) => {
			SpellcheckStore.setEnabled(checked);
		};

		const handleOpenLanguageSettings = async () => {
			if (!electronAPI) return;
			await electronAPI.spellcheckOpenLanguageSettings();
			onClose();
		};

		const spellcheckEnabled = SpellcheckStore.enabled;
		const hasMisspelling = spellcheckEnabled && misspelledWord && suggestions.length > 0;

		return (
			<>
				{hasMisspelling && (
					<>
						<MenuGroup>
							{suggestions.slice(0, 6).map((suggestion) => (
								<MenuItem key={suggestion} onClick={() => handleReplaceMisspelling(suggestion)}>
									{suggestion}
								</MenuItem>
							))}
						</MenuGroup>
						<MenuGroup>
							<MenuItem onClick={handleAddToDictionary}>{t`Add to Dictionary`}</MenuItem>
						</MenuGroup>
					</>
				)}

				<MenuGroup>
					<MenuItem
						icon={<ArrowCounterClockwiseIcon />}
						onClick={() => execCommand('undo')}
						disabled={!editFlags?.canUndo}
					>
						{t`Undo`}
					</MenuItem>
					<MenuItem icon={<ArrowClockwiseIcon />} onClick={() => execCommand('redo')} disabled={!editFlags?.canRedo}>
						{t`Redo`}
					</MenuItem>
				</MenuGroup>

				<MenuGroup>
					<MenuItem icon={<ScissorsIcon />} onClick={() => execCommand('cut')} disabled={!editFlags?.canCut}>
						{t`Cut`}
					</MenuItem>
					<MenuItem icon={<CopyIcon />} onClick={() => execCommand('copy')} disabled={!editFlags?.canCopy}>
						{t`Copy`}
					</MenuItem>
					<MenuItem icon={<ClipboardTextIcon />} onClick={() => execCommand('paste')} disabled={!editFlags?.canPaste}>
						{t`Paste`}
					</MenuItem>
					<MenuItem
						icon={<SelectionIcon />}
						onClick={() => execCommand('selectAll')}
						disabled={!editFlags?.canSelectAll}
					>
						{t`Select All`}
					</MenuItem>
				</MenuGroup>

				{showSpellMenu && (
					<MenuGroup>
						<MenuItemCheckbox checked={spellcheckEnabled} onChange={handleToggleSpellcheck}>
							{t`Spellcheck`}
						</MenuItemCheckbox>
						<MenuItem onClick={handleOpenLanguageSettings}>{t`Languages…`}</MenuItem>
					</MenuGroup>
				)}
			</>
		);
	},
);
