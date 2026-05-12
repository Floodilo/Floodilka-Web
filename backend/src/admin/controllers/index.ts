/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {HonoApp} from '~/App';
import {ApplicationAdminController} from './ApplicationAdminController';
import {ArchiveAdminController} from './ArchiveAdminController';
import {AssetAdminController} from './AssetAdminController';
import {AuditLogAdminController} from './AuditLogAdminController';
import {BanAdminController} from './BanAdminController';
import {BulkAdminController} from './BulkAdminController';
import {CodesAdminController} from './CodesAdminController';
import {FeatureFlagAdminController} from './FeatureFlagAdminController';
import {GatewayAdminController} from './GatewayAdminController';
import {GuildAdminController} from './GuildAdminController';
import {InstanceConfigAdminController} from './InstanceConfigAdminController';
import {MessageAdminController} from './MessageAdminController';
import {ReportAdminController} from './ReportAdminController';
import {SearchAdminController} from './SearchAdminController';
import {SnowflakeReservationAdminController} from './SnowflakeReservationAdminController';
import {SystemAdminController} from './SystemAdminController';
import {UserAdminController} from './UserAdminController';
import {VoiceAdminController} from './VoiceAdminController';

export const registerAdminControllers = (app: HonoApp) => {
	UserAdminController(app);
	CodesAdminController(app);
	GuildAdminController(app);
	ApplicationAdminController(app);
	AssetAdminController(app);
	BanAdminController(app);
	InstanceConfigAdminController(app);
	SnowflakeReservationAdminController(app);
	MessageAdminController(app);
	BulkAdminController(app);
	AuditLogAdminController(app);
	ArchiveAdminController(app);
	ReportAdminController(app);
	VoiceAdminController(app);
	GatewayAdminController(app);
	SystemAdminController(app);
	SearchAdminController(app);
	FeatureFlagAdminController(app);
};
