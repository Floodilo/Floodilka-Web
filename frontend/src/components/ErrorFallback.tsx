/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {Trans} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import errorFallbackStyles from '~/components/ErrorFallback.module.css';
import {FloodilkaIcon} from '~/components/icons/FloodilkaIcon';
import {NativeTitlebar} from '~/components/layout/NativeTitlebar';
import {Button} from '~/components/uikit/Button/Button';
import {useNativePlatform} from '~/hooks/useNativePlatform';
import AppStorage from '~/lib/AppStorage';
import {ensureLatestAssets} from '~/lib/versioning';

interface ErrorFallbackProps {
	error?: Error;
	reset?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = observer(() => {
	const {platform, isNative, isMacOS} = useNativePlatform();
	const [updateAvailable, setUpdateAvailable] = React.useState(false);
	const [isUpdating, setIsUpdating] = React.useState(false);
	const [checkingForUpdates, setCheckingForUpdates] = React.useState(true);

	React.useEffect(() => {
		let isMounted = true;

		const run = async () => {
			try {
				const {updateFound} = await ensureLatestAssets({force: true});
				if (isMounted) {
					setUpdateAvailable(updateFound);
				}
			} catch (error) {
				console.error('[ErrorFallback] Failed to check for updates:', error);
			} finally {
				if (isMounted) {
					setCheckingForUpdates(false);
				}
			}
		};

		void run();

		return () => {
			isMounted = false;
		};
	}, []);

	const handleUpdate = React.useCallback(async () => {
		setIsUpdating(true);
		try {
			const {updateFound} = await ensureLatestAssets({force: true});
			if (!updateFound) {
				setIsUpdating(false);
				window.location.reload();
			}
		} catch (error) {
			console.error('[ErrorFallback] Failed to apply update:', error);
			setIsUpdating(false);
		}
	}, []);

	return (
		<div className={errorFallbackStyles.errorFallbackContainer}>
			{isNative && !isMacOS && <NativeTitlebar platform={platform} />}
			<FloodilkaIcon className={errorFallbackStyles.errorFallbackIcon} />
			<div className={errorFallbackStyles.errorFallbackContent}>
				<h1 className={errorFallbackStyles.errorFallbackTitle}>
					<Trans>Whoa, this is heavy.</Trans>
				</h1>
				<p className={errorFallbackStyles.errorFallbackDescription}>
					{checkingForUpdates ? (
						<Trans>The app has crashed. Checking for updates that might fix this issue...</Trans>
					) : updateAvailable ? (
						<Trans>Something went wrong and the app crashed. An update is available that may fix this issue.</Trans>
					) : (
						<Trans>Something went wrong and the app crashed. Try reloading or resetting the app.</Trans>
					)}
				</p>
			</div>
			<div className={errorFallbackStyles.errorFallbackActions}>
				<Button
					onClick={updateAvailable ? handleUpdate : () => location.reload()}
					disabled={checkingForUpdates || isUpdating}
				>
					{isUpdating ? (
						<Trans>Updating...</Trans>
					) : checkingForUpdates || updateAvailable ? (
						<Trans>Update app</Trans>
					) : (
						<Trans>Reload app</Trans>
					)}
				</Button>
				<Button
					onClick={() => {
						AppStorage.clear();
						location.reload();
					}}
					variant="danger-primary"
					disabled={checkingForUpdates}
				>
					<Trans>Reset app data</Trans>
				</Button>
			</div>
		</div>
	);
});
