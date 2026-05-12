/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UserID} from '~/BrandedTypes';
import {RelationshipTypes, UserFlags} from '~/Constants';
import {CannotSendMessagesToUserError, UnclaimedAccountRestrictedError} from '~/Errors';
import type {IGuildRepository} from '~/guild/IGuildRepository';
import type {User} from '~/Models';
import type {IUserRepository} from '~/user/IUserRepository';
import {checkGuildVerificationWithGuildModel} from '~/utils/GuildVerificationUtils';

interface DMPermissionValidatorDeps {
	userRepository: IUserRepository;
	guildRepository: IGuildRepository;
}

export class DMPermissionValidator {
	constructor(private deps: DMPermissionValidatorDeps) {}

	async validate({recipients, userId}: {recipients: Array<User>; userId: UserID}): Promise<void> {
		const senderUser = await this.deps.userRepository.findUnique(userId);
		if (senderUser && senderUser.isUnclaimedAccount()) {
			throw new UnclaimedAccountRestrictedError('отправлять личные сообщения');
		}

		const targetUser = recipients.find((recipient) => recipient.id !== userId);
		if (!targetUser) return;

		const senderBlockedTarget = await this.deps.userRepository.getRelationship(
			userId,
			targetUser.id,
			RelationshipTypes.BLOCKED,
		);
		if (senderBlockedTarget) {
			throw new CannotSendMessagesToUserError();
		}

		const targetBlockedSender = await this.deps.userRepository.getRelationship(
			targetUser.id,
			userId,
			RelationshipTypes.BLOCKED,
		);
		if (targetBlockedSender) {
			throw new CannotSendMessagesToUserError();
		}

		const friendship = await this.deps.userRepository.getRelationship(userId, targetUser.id, RelationshipTypes.FRIEND);
		if (friendship) return;

		if (targetUser.flags & UserFlags.APP_STORE_REVIEWER) {
			throw new CannotSendMessagesToUserError();
		}

		const targetSettings = await this.deps.userRepository.findSettings(targetUser.id);
		if (!targetSettings) return;

		const dmRestrictionsEnabled = targetSettings.defaultGuildsRestricted || targetSettings.restrictedGuilds.size > 0;
		if (!dmRestrictionsEnabled) {
			return;
		}

		const [userGuilds, targetGuilds] = await Promise.all([
			this.deps.guildRepository.listUserGuilds(userId),
			this.deps.guildRepository.listUserGuilds(targetUser.id),
		]);

		if (!senderUser) {
			throw new CannotSendMessagesToUserError();
		}

		const userGuildIds = new Set(userGuilds.map((guild) => guild.id));
		const mutualGuilds = targetGuilds.filter((guild) => userGuildIds.has(guild.id));

		if (mutualGuilds.length === 0) {
			throw new CannotSendMessagesToUserError();
		}

		const restrictedGuildIds = targetSettings.restrictedGuilds;

		let hasValidMutualGuild = false;
		for (const guild of mutualGuilds) {
			if (restrictedGuildIds.has(guild.id)) {
				continue;
			}

			const member = await this.deps.guildRepository.getMember(guild.id, userId);
			if (!member) {
				continue;
			}

			try {
				checkGuildVerificationWithGuildModel({user: senderUser, guild, member});
				hasValidMutualGuild = true;
				break;
			} catch {}
		}

		if (!hasValidMutualGuild) {
			throw new CannotSendMessagesToUserError();
		}
	}
}
