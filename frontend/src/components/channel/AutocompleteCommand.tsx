/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import type {MutableRefObject} from 'react';

import {type AutocompleteOption, type Command, isCommand} from './Autocomplete';
import {AutocompleteItem} from './AutocompleteItem';

type Props = {
	onSelect: (option: AutocompleteOption) => void;
	keyboardFocusIndex: number;
	hoverIndex: number;
	options: Array<AutocompleteOption>;
	onMouseEnter: (index: number) => void;
	onMouseLeave: () => void;
	rowRefs?: MutableRefObject<Array<HTMLButtonElement | null>>;
};

export const AutocompleteCommand = observer(
	({onSelect, keyboardFocusIndex, hoverIndex, options, onMouseEnter, onMouseLeave, rowRefs}: Props) => {
		const {t} = useLingui();

		const getCommandDescription = (command: Command): string | undefined => {
			if (command.type === 'simple') {
				const content = command.content;
				return t`Appends ${content} to your message.`;
			}

			switch (command.name) {
				case '/nick':
					return t`Change your nickname in this community.`;
				case '/kick':
					return t`Kick a member from this community.`;
				case '/ban':
					return t`Ban a member from this community.`;
				case '/msg':
					return t`Send a direct message to a user.`;
				case '/saved':
					return t`Send a saved media item.`;
				case '/sticker':
					return t`Send a sticker.`;
				case '/me':
					return t`Send an action message (wraps in italics).`;
				case '/spoiler':
					return t`Send a spoiler message (wraps in spoiler tags).`;
				case '/gif':
					return t`Search for and send a GIF.`;
				case '/klipy':
					return t`Search for and send a GIF from Klipy.`;
				default:
					return undefined;
			}
		};

		const commands = options.filter(isCommand);

		return commands.map((option, index) => {
			const description = getCommandDescription(option.command);

			return (
				<AutocompleteItem
					key={option.command.name}
					name={option.command.name}
					description={description}
					isKeyboardSelected={index === keyboardFocusIndex}
					isHovered={index === hoverIndex}
					onSelect={() => onSelect(option)}
					onMouseEnter={() => onMouseEnter(index)}
					onMouseLeave={onMouseLeave}
					innerRef={
						rowRefs
							? (node: HTMLButtonElement | null) => {
									rowRefs.current[index] = node;
								}
							: undefined
					}
				/>
			);
		});
	},
);
