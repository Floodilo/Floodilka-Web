/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {makeAutoObservable, runInAction} from 'mobx';
import * as ModalActionCreators from '~/actions/ModalActionCreators';
import {modal} from '~/actions/ModalActionCreators';
import {KeyboardModeIntroModal} from '~/components/modals/KeyboardModeIntroModal';
import {Logger} from '~/lib/Logger';
import {makePersistent} from '~/lib/MobXPersistence';

const logger = new Logger('KeyboardModeStore');

class KeyboardModeStore {
	keyboardModeEnabled = false;
	introSeen = false;

	constructor() {
		makeAutoObservable(this, {}, {autoBind: true});
		void makePersistent(this, 'KeyboardModeStore', ['introSeen']);
	}

	enterKeyboardMode(showIntro = true): void {
		logger.debug(
			`Entering keyboard mode (showIntro=${showIntro}) previous=${this.keyboardModeEnabled ? 'true' : 'false'}`,
		);
		runInAction(() => {
			this.keyboardModeEnabled = true;
		});

		if (showIntro && !this.introSeen) {
			this.introSeen = true;
			ModalActionCreators.push(modal(() => <KeyboardModeIntroModal />));
		}
	}

	exitKeyboardMode(): void {
		if (!this.keyboardModeEnabled) {
			logger.debug('exitKeyboardMode ignored (already false)');
			return;
		}
		logger.debug('Exiting keyboard mode');
		runInAction(() => {
			this.keyboardModeEnabled = false;
		});
	}

	dismissIntro(): void {
		this.introSeen = true;
	}
}

export default new KeyboardModeStore();
