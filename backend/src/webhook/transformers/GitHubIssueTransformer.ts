/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {RichEmbedRequest} from '~/channel/ChannelModel';
import {parseString} from '~/utils/StringUtils';
import type {GitHubWebhook} from './GitHubTypes';

export const transformIssue = async (body: GitHubWebhook): Promise<RichEmbedRequest | null> => {
	if (!(body.issue && body.action && body.repository)) {
		return null;
	}

	const authorIconUrl = body.issue.user.avatar_url;
	const authorName = body.issue.user.login;
	const authorUrl = body.issue.user.html_url;
	const repoName = body.repository.full_name;
	const issueNumber = body.issue.number;
	const issueTitle = body.issue.title;
	const issueUrl = body.issue.html_url;
	const issueDescription = body.issue.body || '';

	let title: string;
	let color: number;

	switch (body.action) {
		case 'opened': {
			title = `[${repoName}] Issue opened: #${issueNumber} ${issueTitle}`;
			color = 0xeb4841;
			break;
		}
		case 'closed': {
			title = `[${repoName}] Issue closed: #${issueNumber} ${issueTitle}`;
			color = 0x000000;
			break;
		}
		case 'reopened': {
			title = `[${repoName}] Issue reopened: #${issueNumber} ${issueTitle}`;
			color = 0xfcbd1f;
			break;
		}
		default:
			return null;
	}

	return {
		title: parseString(title, 70),
		url: issueUrl,
		color,
		description: body.action === 'opened' ? parseString(issueDescription, 350) : undefined,
		author: {
			name: authorName,
			url: authorUrl,
			icon_url: authorIconUrl,
		},
	};
};

export const transformIssueComment = async (body: GitHubWebhook): Promise<RichEmbedRequest | null> => {
	if (!body.comment || body.action !== 'created' || !body.issue || !body.repository) {
		return null;
	}

	const authorIconUrl = body.comment.user.avatar_url;
	const authorName = body.comment.user.login;
	const authorUrl = body.comment.user.html_url;
	const repoName = body.repository.full_name;
	const issueNumber = body.issue.number;
	const issueTitle = body.issue.title;
	const commentUrl = body.comment.html_url;
	const commentBody = body.comment.body;
	const isPullRequest = body.pull_request != null;

	const titlePrefix = isPullRequest ? 'pull request' : 'issue';
	const title = `[${repoName}] New comment on ${titlePrefix} #${issueNumber}: ${issueTitle}`;
	const color = 0xc00a7f;

	return {
		title: parseString(title, 70),
		url: commentUrl,
		color,
		description: parseString(commentBody, 350),
		author: {
			name: authorName,
			url: authorUrl,
			icon_url: authorIconUrl,
		},
	};
};
