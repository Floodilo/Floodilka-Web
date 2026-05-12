/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {createEmojiID, type EmojiID, type UserID} from '~/BrandedTypes';
import {InputValidationError} from '~/errors/InputValidationError';
import type {IGuildRepository} from '~/guild/IGuildRepository';
import type {PackService} from '~/pack/PackService';
import type {z} from '~/Schema';
import type {IUserAccountRepository} from '~/user/repositories/IUserAccountRepository';
import type {CustomStatusPayload} from '~/user/UserTypes';

export interface ValidatedCustomStatus {
	text: string | null;
	expiresAt: Date | null;
	emojiId: EmojiID | null;
	emojiName: string | null;
	emojiAnimated: boolean;
}

export class CustomStatusValidator {
	constructor(
		private readonly userAccountRepository: IUserAccountRepository,
		private readonly guildRepository: IGuildRepository,
		private readonly packService: PackService,
	) {}

	async validate(userId: UserID, payload: z.infer<typeof CustomStatusPayload>): Promise<ValidatedCustomStatus> {
		const text = payload.text ?? null;
		const expiresAt = payload.expires_at ?? null;
		let emojiId: EmojiID | null = null;
		let emojiName: string | null = null;
		let emojiAnimated = false;

		if (payload.emoji_id != null) {
			emojiId = createEmojiID(payload.emoji_id);

			const emoji = await this.guildRepository.getEmojiById(emojiId);
			if (!emoji) {
				throw InputValidationError.create('custom_status.emoji_id', 'Пользовательский эмодзи не найден');
			}

			const user = await this.userAccountRepository.findUnique(userId);
			if (!user?.canUseGlobalExpressions()) {
				throw InputValidationError.create('custom_status.emoji_id', 'Для использования пользовательских эмодзи требуется премиум');
			}

			const guildMember = await this.guildRepository.getMember(emoji.guildId, userId);

			let hasAccess = guildMember !== null;
			if (!hasAccess) {
				const resolver = await this.packService.createPackExpressionAccessResolver({
					userId,
					type: 'emoji',
				});
				const resolution = await resolver.resolve(emoji.guildId);
				hasAccess = resolution === 'accessible';
			}

			if (!hasAccess) {
				throw InputValidationError.create(
					'custom_status.emoji_id',
					'Нельзя использовать этот эмодзи без доступа к серверу или установленному набору',
				);
			}

			emojiName = emoji.name;
			emojiAnimated = emoji.isAnimated;
		} else if (payload.emoji_name != null) {
			emojiName = payload.emoji_name;
		}

		return {
			text,
			expiresAt,
			emojiId,
			emojiName,
			emojiAnimated,
		};
	}
}
