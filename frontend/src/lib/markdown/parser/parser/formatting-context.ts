/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {MAX_INLINE_DEPTH} from '../types/constants';

export class FormattingContext {
	private readonly activeFormattingTypes = new Map<string, boolean>();
	private readonly formattingStack: Array<[string, boolean]> = [];
	private currentDepth = 0;

	canEnterFormatting(delimiter: string, isDouble: boolean): boolean {
		const key = this.getFormattingKey(delimiter, isDouble);
		if (this.activeFormattingTypes.has(key)) return false;
		return this.currentDepth < MAX_INLINE_DEPTH;
	}

	isFormattingActive(delimiter: string, isDouble: boolean): boolean {
		return this.activeFormattingTypes.has(this.getFormattingKey(delimiter, isDouble));
	}

	pushFormatting(delimiter: string, isDouble: boolean): void {
		this.formattingStack.push([delimiter, isDouble]);
		this.activeFormattingTypes.set(this.getFormattingKey(delimiter, isDouble), true);
		this.currentDepth++;
	}

	popFormatting(): [string, boolean] | undefined {
		const removed = this.formattingStack.pop();
		if (removed) {
			this.activeFormattingTypes.delete(this.getFormattingKey(removed[0], removed[1]));
			this.currentDepth--;
		}
		return removed;
	}

	setCurrentText(_text: string): void {}

	private getFormattingKey(delimiter: string, isDouble: boolean): string {
		return `${delimiter}${isDouble ? '2' : '1'}`;
	}
}
