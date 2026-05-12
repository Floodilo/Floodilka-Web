/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import React from 'react';
import {type CloudAttachment, CloudUpload, type MessageUpload} from '~/lib/CloudUpload';

export function useTextareaAttachments(channelId: string): ReadonlyArray<CloudAttachment> {
	const [attachments, setAttachments] = React.useState<ReadonlyArray<CloudAttachment>>(() =>
		CloudUpload.getTextareaAttachments(channelId),
	);

	React.useEffect(() => {
		const subscription = CloudUpload.attachments$(channelId).subscribe(setAttachments);
		return () => subscription.unsubscribe();
	}, [channelId]);

	return attachments;
}

export function useMessageUpload(nonce: string): MessageUpload | null {
	const [upload, setUpload] = React.useState<MessageUpload | null>(() =>
		nonce ? CloudUpload.getMessageUpload(nonce) : null,
	);

	React.useEffect(() => {
		if (!nonce) {
			setUpload(null);
			return;
		}

		const subscription = CloudUpload.messageUpload$(nonce).subscribe((next) => {
			setUpload(next);
		});

		return () => subscription.unsubscribe();
	}, [nonce]);

	return upload;
}
