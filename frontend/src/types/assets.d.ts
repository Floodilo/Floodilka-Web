/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

declare module '*.svg?react' {
	import type {FunctionComponent, SVGProps} from 'react';
	const content: FunctionComponent<SVGProps<SVGSVGElement> & {title?: string}>;
	export default content;
}

declare module '*.svg' {
	const content: string;
	export default content;
}

declare module '*.css' {
	const content: never;
	export default content;
}

declare module '*.png' {
	const content: string;
	export default content;
}

declare module '*.jpg' {
	const content: string;
	export default content;
}

declare module '*.jpeg' {
	const content: string;
	export default content;
}

declare module '*.gif' {
	const content: string;
	export default content;
}

declare module '*.webp' {
	const content: string;
	export default content;
}

declare module '*.mp3' {
	const content: string;
	export default content;
}

declare module '*.wav' {
	const content: string;
	export default content;
}

declare module '*.ogg' {
	const content: string;
	export default content;
}

declare module '*.mp4' {
	const content: string;
	export default content;
}

declare module '*.webm' {
	const content: string;
	export default content;
}

declare module '*?worker' {
	const workerConstructor: {
		new (): Worker;
	};
	export default workerConstructor;
}

declare module '*?sharedworker' {
	const sharedWorkerConstructor: {
		new (): SharedWorker;
	};
	export default sharedWorkerConstructor;
}

declare module '*.po' {
	import type {Messages} from '@lingui/core';
	export const messages: Messages;
}
