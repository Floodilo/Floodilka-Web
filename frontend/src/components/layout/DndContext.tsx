/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type React from 'react';
import KeyboardBackend, {isKeyboardDragTrigger} from 'react-dnd-accessible-backend';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {createTransition, DndProvider, MouseTransition} from 'react-dnd-multi-backend';

const KeyboardTransition = createTransition('keydown', (event: Event) => {
	if (!isKeyboardDragTrigger(event as KeyboardEvent)) return false;
	event.preventDefault();
	return true;
});

const DND_OPTIONS = {
	backends: [
		{
			id: 'html5',
			backend: HTML5Backend,
			transition: MouseTransition,
		},
		{
			id: 'keyboard',
			backend: KeyboardBackend,
			context: {window, document},
			preview: true,
			transition: KeyboardTransition,
		},
	],
};

interface DndContextProps {
	children: React.ReactNode;
}

export const DndContext = ({children}: DndContextProps) => {
	return <DndProvider options={DND_OPTIONS}>{children}</DndProvider>;
};
