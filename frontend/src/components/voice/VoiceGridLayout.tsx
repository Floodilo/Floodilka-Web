/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {TrackReferenceOrPlaceholder} from '@livekit/components-react';
import {isTrackReference, ParticipantContext, TrackRefContext} from '@livekit/components-react';
import type React from 'react';

interface VoiceGridLayoutProps {
	tracks: Array<TrackReferenceOrPlaceholder>;
	children: React.ReactElement;
	horizontal?: boolean;
}

export function VoiceGridLayout({tracks, children, horizontal}: VoiceGridLayoutProps) {
	return (
		<div className={horizontal ? 'voice-grid voice-grid--horizontal' : 'voice-grid'}>
			{tracks.map((trackRef, index) => {
				const key = isTrackReference(trackRef)
					? `${trackRef.participant.identity}-${trackRef.source}`
					: `placeholder-${trackRef.participant.identity}-${index}`;

				return (
					<TrackRefContext.Provider key={key} value={trackRef}>
						<ParticipantContext.Provider value={trackRef.participant}>{children}</ParticipantContext.Provider>
					</TrackRefContext.Provider>
				);
			})}
		</div>
	);
}
