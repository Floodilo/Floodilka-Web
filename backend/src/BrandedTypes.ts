/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

declare const __brand: unique symbol;

type Brand<T, TBrand extends string> = T & {readonly [__brand]: TBrand};
interface BrandedValue {
	readonly [__brand]: unknown;
}

const brand = <TValue extends string | bigint, TBrand extends string>(value: TValue): Brand<TValue, TBrand> =>
	value as Brand<TValue, TBrand>;

const rebrand = <TValue extends string | bigint, TBrand extends string>(
	value: Brand<TValue, string>,
): Brand<TValue, TBrand> => value as Brand<TValue, TBrand>;

export type UserID = Brand<bigint, 'UserID'>;
export type GuildID = Brand<bigint, 'GuildID'>;
export type ChannelID = Brand<bigint, 'ChannelID'>;
export type MessageID = Brand<bigint, 'MessageID'>;
export type RoleID = Brand<bigint, 'RoleID'>;
export type EmojiID = Brand<bigint, 'EmojiID'>;
export type WebhookID = Brand<bigint, 'WebhookID'>;
export type AttachmentID = Brand<bigint, 'AttachmentID'>;
export type StickerID = Brand<bigint, 'StickerID'>;
export type ReportID = Brand<bigint, 'ReportID'>;
export type MemeID = Brand<bigint, 'MemeID'>;
export type ApplicationID = Brand<bigint, 'ApplicationID'>;

export type InviteCode = Brand<string, 'InviteCode'>;
export type VanityURLCode = Brand<string, 'VanityURLCode'>;
export type EmailVerificationToken = Brand<string, 'EmailVerificationToken'>;
export type PasswordResetToken = Brand<string, 'PasswordResetToken'>;
export type EmailRevertToken = Brand<string, 'EmailRevertToken'>;
type MfaTicket = Brand<string, 'MfaTicket'>;
export type WebhookToken = Brand<string, 'WebhookToken'>;
export type MfaBackupCode = Brand<string, 'MfaBackupCode'>;
export type PhoneVerificationToken = Brand<string, 'PhoneVerificationToken'>;

export const createUserID = <T extends bigint>(id: T extends BrandedValue ? never : T): UserID =>
	brand<T, 'UserID'>(id);
export const createGuildID = <T extends bigint>(id: T extends BrandedValue ? never : T): GuildID =>
	brand<T, 'GuildID'>(id);
export const createChannelID = <T extends bigint>(id: T extends BrandedValue ? never : T): ChannelID =>
	brand<T, 'ChannelID'>(id);
export const createMessageID = <T extends bigint>(id: T extends BrandedValue ? never : T): MessageID =>
	brand<T, 'MessageID'>(id);
export const createRoleID = <T extends bigint>(id: T extends BrandedValue ? never : T): RoleID =>
	brand<T, 'RoleID'>(id);
export const createEmojiID = <T extends bigint>(id: T extends BrandedValue ? never : T): EmojiID =>
	brand<T, 'EmojiID'>(id);
export const createWebhookID = <T extends bigint>(id: T extends BrandedValue ? never : T): WebhookID =>
	brand<T, 'WebhookID'>(id);
export const createAttachmentID = <T extends bigint>(id: T extends BrandedValue ? never : T): AttachmentID =>
	brand<T, 'AttachmentID'>(id);
export const createStickerID = <T extends bigint>(id: T extends BrandedValue ? never : T): StickerID =>
	brand<T, 'StickerID'>(id);
export const createReportID = <T extends bigint>(id: T extends BrandedValue ? never : T): ReportID =>
	brand<T, 'ReportID'>(id);
export const createMemeID = <T extends bigint>(id: T extends BrandedValue ? never : T): MemeID =>
	brand<T, 'MemeID'>(id);
export const createApplicationID = <T extends bigint>(id: T extends BrandedValue ? never : T): ApplicationID =>
	brand<T, 'ApplicationID'>(id);

export const createInviteCode = <T extends string>(code: T extends BrandedValue ? never : T): InviteCode =>
	brand<T, 'InviteCode'>(code);
export const createVanityURLCode = <T extends string>(code: T extends BrandedValue ? never : T): VanityURLCode =>
	brand<T, 'VanityURLCode'>(code);
export const createEmailVerificationToken = <T extends string>(
	token: T extends BrandedValue ? never : T,
): EmailVerificationToken => brand<T, 'EmailVerificationToken'>(token);
export const createPasswordResetToken = <T extends string>(
	token: T extends BrandedValue ? never : T,
): PasswordResetToken => brand<T, 'PasswordResetToken'>(token);
export const createEmailRevertToken = <T extends string>(token: T extends BrandedValue ? never : T): EmailRevertToken =>
	brand<T, 'EmailRevertToken'>(token);
export const createMfaTicket = <T extends string>(ticket: T extends BrandedValue ? never : T): MfaTicket =>
	brand<T, 'MfaTicket'>(ticket);
export const createWebhookToken = <T extends string>(token: T extends BrandedValue ? never : T): WebhookToken =>
	brand<T, 'WebhookToken'>(token);
export const createMfaBackupCode = <T extends string>(code: T extends BrandedValue ? never : T): MfaBackupCode =>
	brand<T, 'MfaBackupCode'>(code);
export const createPhoneVerificationToken = <T extends string>(
	token: T extends BrandedValue ? never : T,
): PhoneVerificationToken => brand<T, 'PhoneVerificationToken'>(token);

export const createUserIDSet = (ids: Set<bigint>): Set<UserID> => ids as Set<UserID>;
export const createGuildIDSet = (ids: Set<bigint>): Set<GuildID> => ids as Set<GuildID>;
export const createRoleIDSet = (ids: Set<bigint>): Set<RoleID> => ids as Set<RoleID>;
export const guildIdToRoleId = (guildId: GuildID): RoleID => rebrand<bigint, 'RoleID'>(guildId);
export const channelIdToUserId = (channelId: ChannelID): UserID => rebrand<bigint, 'UserID'>(channelId);
export const userIdToChannelId = (userId: UserID): ChannelID => rebrand<bigint, 'ChannelID'>(userId);
export const vanityCodeToInviteCode = (vanityCode: VanityURLCode): InviteCode =>
	rebrand<string, 'InviteCode'>(vanityCode);
export const channelIdToMessageId = (channelId: ChannelID): MessageID => rebrand<bigint, 'MessageID'>(channelId);
export const applicationIdToUserId = (applicationId: ApplicationID): UserID => rebrand<bigint, 'UserID'>(applicationId);
