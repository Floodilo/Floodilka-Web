/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {IChannelDataRepository} from './IChannelDataRepository';
import type {IMessageInteractionRepository} from './IMessageInteractionRepository';
import type {IMessageRepository} from './IMessageRepository';

export abstract class IChannelRepositoryAggregate {
	abstract readonly channelData: IChannelDataRepository;
	abstract readonly messages: IMessageRepository;
	abstract readonly messageInteractions: IMessageInteractionRepository;
}
