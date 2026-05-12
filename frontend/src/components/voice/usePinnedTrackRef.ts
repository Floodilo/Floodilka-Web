/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {isTrackReference, type TrackReferenceOrPlaceholder} from '@livekit/components-react';
import {useEffect, useMemo} from 'react';
import * as VoiceCallLayoutActionCreators from '~/actions/VoiceCallLayoutActionCreators';

type LayoutMode = 'grid' | 'focus';

interface UsePinnedTrackRefArgs {
	layoutMode: LayoutMode;
	pinnedParticipantIdentity: string | null;
	filteredCameraTracks: Array<TrackReferenceOrPlaceholder>;
	cameraTracksAll: Array<TrackReferenceOrPlaceholder>;
	screenShareTracks: Array<TrackReferenceOrPlaceholder>;
}

function identityOf(track: TrackReferenceOrPlaceholder): string {
	return track.participant?.identity ?? '';
}

function sortByParticipantIdentity(tracks: Array<TrackReferenceOrPlaceholder>) {
	return [...tracks].sort((a, b) => identityOf(a).localeCompare(identityOf(b)));
}

function findByIdentity(
	tracks: Array<TrackReferenceOrPlaceholder>,
	identity: string | null,
): TrackReferenceOrPlaceholder | null {
	if (!identity) return null;
	return tracks.find((t) => identityOf(t) === identity) ?? null;
}

export function usePinnedTrackRef({
	layoutMode,
	pinnedParticipantIdentity,
	filteredCameraTracks,
	cameraTracksAll,
	screenShareTracks,
}: UsePinnedTrackRefArgs) {
	const cameraBase = filteredCameraTracks.length > 0 ? filteredCameraTracks : cameraTracksAll;

	const camerasSorted = useMemo(() => sortByParticipantIdentity(cameraBase), [cameraBase]);
	const screensSorted = useMemo(() => sortByParticipantIdentity(screenShareTracks), [screenShareTracks]);

	const defaultFocusTrack = useMemo<TrackReferenceOrPlaceholder | null>(() => {
		return screensSorted[0] ?? camerasSorted[0] ?? null;
	}, [screensSorted, camerasSorted]);

	const pinnedTrack = useMemo(() => {
		const fromScreens = findByIdentity(screensSorted, pinnedParticipantIdentity);
		if (fromScreens) return fromScreens;
		return findByIdentity(camerasSorted, pinnedParticipantIdentity);
	}, [screensSorted, camerasSorted, pinnedParticipantIdentity]);

	const mainTrack = useMemo<TrackReferenceOrPlaceholder | null>(() => {
		if (layoutMode !== 'focus') return null;
		return pinnedTrack ?? defaultFocusTrack;
	}, [layoutMode, pinnedTrack, defaultFocusTrack]);

	const carouselTracks = useMemo<Array<TrackReferenceOrPlaceholder>>(() => camerasSorted, [camerasSorted]);

	useEffect(() => {
		if (layoutMode !== 'focus') return;
		if (pinnedParticipantIdentity) return;

		if (defaultFocusTrack && isTrackReference(defaultFocusTrack)) {
			const identity = identityOf(defaultFocusTrack);
			if (identity) VoiceCallLayoutActionCreators.setPinnedParticipant(identity);
		}
	}, [layoutMode, pinnedParticipantIdentity, defaultFocusTrack]);

	return {mainTrack, carouselTracks};
}
