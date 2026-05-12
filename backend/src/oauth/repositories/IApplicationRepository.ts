/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {ApplicationID, UserID} from '~/BrandedTypes';
import type {ApplicationRow, OAuthBotTokenByClientRow} from '~/database/types/OAuth2Types';
import type {Application} from '~/models/Application';

export interface IApplicationRepository {
	getApplication(applicationId: ApplicationID): Promise<Application | null>;
	listApplicationsByOwner(ownerUserId: UserID): Promise<Array<Application>>;
	upsertApplication(data: ApplicationRow, oldData?: ApplicationRow | null): Promise<Application>;
	deleteApplication(applicationId: ApplicationID): Promise<void>;
	recordBotToken(data: OAuthBotTokenByClientRow): Promise<void>;
	listBotTokensByClient(clientId: ApplicationID): Promise<Array<OAuthBotTokenByClientRow>>;
	deleteAllBotTokensByClient(clientId: ApplicationID): Promise<void>;
}
