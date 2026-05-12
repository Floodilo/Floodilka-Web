/*
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (C) 2020-2026 Fluxer Contributors
 * Copyright (C) 2026 Floodilka Contributors
 * Modified by Floodilka Contributors starting March 2026. See LICENSE and NOTICE.
 */

import {useLingui} from '@lingui/react/macro';
import {UploadIcon} from '@phosphor-icons/react';
import {observer} from 'mobx-react-lite';
import React from 'react';
import styles from './UploadDropZone.module.css';

interface UploadDropZoneProps {
	onDrop: (files: Array<File>) => void;
	description: React.ReactNode;
	acceptMultiple?: boolean;
}

export const UploadDropZone: React.FC<UploadDropZoneProps> = observer(
	({onDrop, description, acceptMultiple = true}) => {
		const {t} = useLingui();
		const [isDragging, setIsDragging] = React.useState(false);

		const handleDragOver = (e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(true);
		};

		const handleDragLeave = (e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);
		};

		const handleDrop = (e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsDragging(false);

			const files = Array.from(e.dataTransfer.files);
			if (files.length > 0) {
				onDrop(acceptMultiple ? files : [files[0]]);
			}
		};

		return (
			// biome-ignore lint/a11y/noStaticElementInteractions: Drag-and-drop is a progressive enhancement; file upload button available as alternative
			// biome-ignore lint/a11y/useAriaPropsSupportedByRole: aria-label used for descriptive purposes on drop zone
			<div
				aria-label={t`Drag and drop area for file upload`}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={`${styles.dropZone} ${isDragging ? styles.dropZoneDragging : ''}`}
			>
				<UploadIcon className={styles.icon} />
				<p className={styles.description}>{description}</p>
			</div>
		);
	},
);
