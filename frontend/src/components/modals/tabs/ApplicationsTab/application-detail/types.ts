/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import type {UseFormReturn} from 'react-hook-form';

export interface ApplicationDetailFormValues {
	name: string;
	redirectUris: Array<string>;
	botPublic: boolean;
	botRequireCodeGrant: boolean;
	username?: string;
	avatar?: string | null;
	bio?: string | null;
	banner?: string | null;
	redirectUriInputs: Array<string>;
	builderScopes: Record<string, boolean>;
	builderRedirectUri?: string;
	builderPermissions: Record<string, boolean>;
}

export type ApplicationDetailForm = UseFormReturn<ApplicationDetailFormValues>;
