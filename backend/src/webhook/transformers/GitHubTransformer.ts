/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {RichEmbedRequest} from '~/channel/ChannelModel';
import {
	transformCheckRun,
	transformCheckSuite,
	transformDiscussion,
	transformDiscussionComment,
} from './GitHubCheckTransformer';
import {transformCommitComment, transformCreate, transformDelete, transformPush} from './GitHubCommitTransformer';
import {transformIssue, transformIssueComment} from './GitHubIssueTransformer';
import {
	transformPullRequest,
	transformPullRequestReview,
	transformPullRequestReviewComment,
} from './GitHubPullRequestTransformer';
import {
	transformFork,
	transformMember,
	transformPublic,
	transformRelease,
	transformRepository,
	transformWatch,
} from './GitHubRepositoryTransformer';
import type {GitHubWebhook} from './GitHubTypes';

export {GitHubWebhook} from './GitHubTypes';

export const transform = async (event: string, body: GitHubWebhook): Promise<RichEmbedRequest | null> => {
	switch (event) {
		case 'commit_comment':
			return transformCommitComment(body);
		case 'create':
			return transformCreate(body);
		case 'delete':
			return transformDelete(body);
		case 'fork':
			return transformFork(body);
		case 'issue_comment':
			return transformIssueComment(body);
		case 'issues':
			return transformIssue(body);
		case 'member':
			return transformMember(body);
		case 'public':
			return transformPublic(body);
		case 'pull_request':
			return transformPullRequest(body);
		case 'pull_request_review':
			return transformPullRequestReview(body);
		case 'pull_request_review_comment':
			return transformPullRequestReviewComment(body);
		case 'push':
			return transformPush(body);
		case 'release':
			return transformRelease(body);
		case 'watch':
			return transformWatch(body);
		case 'check_run':
			return transformCheckRun(body);
		case 'check_suite':
			return transformCheckSuite(body);
		case 'discussion':
			return transformDiscussion(body);
		case 'discussion_comment':
			return transformDiscussionComment(body);
		case 'repository':
			return transformRepository(body);
		default:
			return null;
	}
};
