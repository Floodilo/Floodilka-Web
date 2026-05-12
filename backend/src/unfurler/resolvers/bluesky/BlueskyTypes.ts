/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

type FacetFeatureType =
	| 'app.bsky.richtext.facet#link'
	| 'app.bsky.richtext.facet#mention'
	| 'app.bsky.richtext.facet#tag';

interface FacetFeature {
	$type: FacetFeatureType;
	uri?: string;
	did?: string;
	tag?: string;
}
interface FacetBytePosition {
	byteStart: number;
	byteEnd: number;
}
export interface Facet {
	index: FacetBytePosition;
	features: [FacetFeature];
}
export interface BlueskyAuthor {
	did: string;
	handle: string;
	displayName?: string;
	avatar?: string;
}
interface BlueskyImageEmbed {
	alt?: string;
	image: {ref: {$link: string}};
}
interface BlueskyVideoEmbed {
	$type: string;
	ref: {$link: string};
	mimeType: string;
	size: number;
}
export interface BlueskyAspectRatio {
	width: number;
	height: number;
}

interface BlueskyRecordEmbed {
	$type: string;
	aspectRatio?: BlueskyAspectRatio;
	video?: BlueskyVideoEmbed;
	images?: Array<BlueskyImageEmbed>;
}

export interface BlueskyPostEmbed {
	$type: 'app.bsky.embed.images#view' | 'app.bsky.embed.video#view' | 'app.bsky.embed.recordWithMedia#view';
	images?: Array<{thumb: string; fullsize: string; alt?: string; aspectRatio?: BlueskyAspectRatio}>;
	video?: {$type: string; cid?: string; aspectRatio?: BlueskyAspectRatio; thumbnail?: string; playlist?: string};
	media?: {
		$type: 'app.bsky.embed.images#view' | 'app.bsky.embed.video#view';
		images?: Array<{thumb: string; fullsize: string; alt?: string; aspectRatio?: BlueskyAspectRatio}>;
		video?: {$type: string; cid?: string; aspectRatio?: BlueskyAspectRatio; thumbnail?: string; playlist?: string};
	};
	record?: {
		$type?: 'app.bsky.embed.record#view';
		record?: {
			$type: 'app.bsky.embed.record#viewRecord';
			uri: string;
			cid: string;
			author: BlueskyAuthor;
			value: {$type: string; text: string; createdAt: string; facets?: Array<Facet>};
			labels?: Array<Record<string, unknown>>;
			indexedAt: string;
			embeds?: Array<Record<string, unknown>>;
		};
	};
}

interface BlueskyRecord {
	text: string;
	createdAt: string;
	facets?: Array<Facet>;
	embed?: BlueskyRecordEmbed;
	reply?: {parent: {cid: string; uri: string}; root: {cid: string; uri: string}};
}

export interface BlueskyPost {
	uri: string;
	author: BlueskyAuthor;
	record: BlueskyRecord;
	embed?: BlueskyPostEmbed;
	indexedAt: string;
	replyCount: number;
	repostCount: number;
	likeCount: number;
	quoteCount: number;
}

export interface BlueskyPostThread {
	thread: {post: BlueskyPost; parent?: {post: BlueskyPost}; replies?: Array<{post: BlueskyPost}>};
}

export interface BlueskyProfile {
	did: string;
	handle: string;
	displayName?: string;
	description?: string;
	avatar?: string;
	banner?: string;
	indexedAt: string;
}

export interface HandleResolution {
	did: string;
}

export interface ProcessedMedia {
	url: string;
	width: number;
	height: number;
	placeholder?: string;
	flags: number;
	description?: string;
	content_type?: string;
	content_hash?: string;
	duration?: number;
}

export interface ProcessedVideoResult {
	thumbnail?: ProcessedMedia;
	video?: ProcessedMedia;
}
export interface ReplyContext {
	authorName: string;
	authorHandle: string;
	postUrl: string;
}
