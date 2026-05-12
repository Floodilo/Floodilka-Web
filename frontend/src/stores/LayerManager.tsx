/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import * as ModalActionCreators from '~/actions/ModalActionCreators';
import * as PopoutActionCreators from '~/actions/PopoutActionCreators';
import type {PopoutKey} from '~/components/uikit/Popout';

type LayerType = 'modal' | 'popout' | 'contextmenu';

export interface Layer {
	type: LayerType;
	key: string | PopoutKey;
	timestamp: number;
	onClose?: () => void;
}

class LayerManager {
	private layers: Array<Layer> = [];
	private isInitialized = false;

	init() {
		if (this.isInitialized) return;
		this.isInitialized = true;

		document.addEventListener('keydown', this.handleGlobalEscape, {capture: true});
	}

	destroy() {
		if (!this.isInitialized) return;
		this.isInitialized = false;

		document.removeEventListener('keydown', this.handleGlobalEscape, {capture: true});
		this.layers = [];
	}

	private handleGlobalEscape = (event: KeyboardEvent) => {
		if (event.key !== 'Escape') return;

		const topLayer = this.getTopLayer();
		if (!topLayer) return;

		event.preventDefault();
		event.stopPropagation();

		if (topLayer.type === 'modal') {
			if (topLayer.onClose) {
				topLayer.onClose();
			} else {
				ModalActionCreators.pop();
			}
		} else if (topLayer.type === 'popout') {
			topLayer.onClose?.();
			this.removeLayer('popout', topLayer.key);
			PopoutActionCreators.close(topLayer.key);
		} else if (topLayer.type === 'contextmenu') {
			topLayer.onClose?.();
		}
	};

	addLayer(type: LayerType, key: string | PopoutKey, onClose?: () => void) {
		this.removeLayer(type, key);

		this.layers.push({
			type,
			key,
			timestamp: Date.now(),
			onClose,
		});
	}

	removeLayer(type: LayerType, key: string | PopoutKey) {
		this.layers = this.layers.filter((layer) => !(layer.type === type && layer.key === key));
	}

	private getTopLayer(): Layer | undefined {
		return this.layers.length > 0 ? this.layers[this.layers.length - 1] : undefined;
	}

	hasLayers(): boolean {
		return this.layers.length > 0;
	}

	isTopLayer(type: LayerType, key: string | PopoutKey): boolean {
		const topLayer = this.getTopLayer();
		return topLayer?.type === type && topLayer?.key === key;
	}

	hasType(type: LayerType): boolean {
		return this.layers.some((l) => l.type === type);
	}

	isTopType(type: LayerType): boolean {
		const top = this.getTopLayer();
		return top?.type === type;
	}

	closeAll(): void {
		ModalActionCreators.popAll();
		PopoutActionCreators.closeAll();
		this.layers = [];
	}
}

export default new LayerManager();
