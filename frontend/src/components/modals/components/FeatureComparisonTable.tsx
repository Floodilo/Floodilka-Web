/*
 * Copyright (C) 2026 Floodilka Contributors
 *
 * This file is part of Floodilka.
 *
 * Floodilka is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Floodilka is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Floodilka. If not, see <https://www.gnu.org/licenses/>.
 */

import {Trans, useLingui} from '@lingui/react/macro';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {ComparisonCategory} from './ComparisonCategory';
import {ComparisonCheckRow} from './ComparisonCheckRow';
import {ComparisonRow} from './ComparisonRow';
import styles from './FeatureComparisonTable.module.css';

type OutlineRect = {
	top: number;
	left: number;
	width: number;
	height: number;
};

export const FeatureComparisonTable = observer(({formatter}: {formatter: Intl.NumberFormat}) => {
	const {t} = useLingui();
	const rootRef = React.useRef<HTMLDivElement>(null);
	const measureRafRef = React.useRef<number>(0);
	const [outlineRect, setOutlineRect] = React.useState<OutlineRect | null>(null);

	const measurePremiumOutline = React.useCallback(() => {
		const root = rootRef.current;
		if (!root) return;
		const startEl = root.querySelector<HTMLElement>('[data-premium-column-start]');
		const endEl = root.querySelector<HTMLElement>('[data-premium-column-end]');
		if (!startEl || !endEl) return;

		// offsetTop/offsetLeft вместо getBoundingClientRect: анимация открытия модалки (scale)
		// искажает клиентские координаты, а layout-координаты от неё не зависят.
		const offsetWithin = (el: HTMLElement): {top: number; left: number} => {
			let top = 0;
			let left = 0;
			let node: HTMLElement | null = el;
			while (node && node !== root) {
				top += node.offsetTop;
				left += node.offsetLeft;
				node = node.offsetParent as HTMLElement | null;
			}
			return {top, left};
		};

		const start = offsetWithin(startEl);
		const end = offsetWithin(endEl);

		setOutlineRect({
			top: start.top,
			left: start.left,
			width: startEl.offsetWidth,
			height: Math.max(0, end.top + endEl.offsetHeight - start.top),
		});
	}, []);

	const scheduleMeasure = React.useCallback(() => {
		window.cancelAnimationFrame(measureRafRef.current);
		measureRafRef.current = window.requestAnimationFrame(measurePremiumOutline);
	}, [measurePremiumOutline]);

	React.useLayoutEffect(() => {
		scheduleMeasure();

		const root = rootRef.current;
		if (!root) return;

		const ro = new ResizeObserver(scheduleMeasure);
		ro.observe(root);

		root.addEventListener('scroll', scheduleMeasure, {passive: true});
		window.addEventListener('resize', scheduleMeasure);

		return () => {
			window.cancelAnimationFrame(measureRafRef.current);
			ro.disconnect();
			root.removeEventListener('scroll', scheduleMeasure);
			window.removeEventListener('resize', scheduleMeasure);
		};
	}, [scheduleMeasure]);

	return (
		<div ref={rootRef} className={styles.table}>
			{outlineRect ? (
				<div
					className={styles.premiumColumnOutline}
					aria-hidden
					style={{
						top: outlineRect.top,
						left: outlineRect.left,
						width: outlineRect.width,
						height: outlineRect.height,
					}}
				/>
			) : null}
			<div className={styles.compareHeader}>
				<div className={styles.compareHeaderSpacer} aria-hidden />
				<div className={styles.planHeadFree}>
					<span className={styles.planColumnLabel}>
						<Trans>Бесплатно</Trans>
					</span>
				</div>
				<div className={styles.planHeadPremium}>
					<div className={styles.planHeadPremiumInner} data-premium-column-start>
						<span className={styles.planNameText}>
							<Trans>Премиум</Trans>
						</span>
					</div>
				</div>
			</div>

			<div className={styles.rows}>
				<ComparisonCategory label={t`Оформление и профиль`} />
				<ComparisonCheckRow feature={t`Отдельные профили в сообществах`} freeHas={false} premiumHas={true} />
				<ComparisonCheckRow feature={t`Значок в профиле`} freeHas={false} premiumHas={true} />
				<ComparisonRow
					feature={t`Свои видеофоны`}
					freeValue={formatter.format(1)}
					premiumValue={formatter.format(15)}
				/>
				<ComparisonCheckRow feature={t`Анимированная карточка профиля`} freeHas={false} premiumHas={true} />
				<ComparisonCheckRow feature={t`Свои звуки входа`} freeHas={false} premiumHas={true} />
				<ComparisonCheckRow feature={t`Свои звуки уведомлений`} freeHas={false} premiumHas={true} />

				<ComparisonCategory label={t`Лимиты и загрузки`} />
				<ComparisonRow
					feature={t`Сообщества`}
					freeValue={formatter.format(100)}
					premiumValue={formatter.format(200)}
				/>
				<ComparisonRow
					feature={t`Лимит символов в сообщении`}
					freeValue={formatter.format(2000)}
					premiumValue={formatter.format(4000)}
				/>
				<ComparisonRow
					feature={t`Закладки с сообщениями`}
					freeValue={formatter.format(50)}
					premiumValue={formatter.format(300)}
				/>
				<ComparisonRow
					feature={t`Лимит символов в описании`}
					freeValue={formatter.format(160)}
					premiumValue={formatter.format(320)}
				/>
				<ComparisonRow feature={t`Размер загружаемых файлов`} freeValue={t`25 МБ`} premiumValue={t`500 МБ`} />
				<ComparisonRow
					feature={t`Сохранённые медиа`}
					freeValue={formatter.format(50)}
					premiumValue={formatter.format(500)}
				/>

				<ComparisonCategory label={t`Медиа и бонусы`} />
				<ComparisonCheckRow feature={t`Анимированные эмодзи`} freeHas={true} premiumHas={true} />
				<ComparisonCheckRow feature={t`Доступ к глобальным эмодзи и стикерам`} freeHas={false} premiumHas={true} />
				<ComparisonRow feature={t`Качество видео`} freeValue={t`720p/30fps`} premiumValue={t`1080p/60fps`} />
				<ComparisonCheckRow feature={t`Анимированные аватары и баннеры`} freeHas={false} premiumHas={true} />
				<ComparisonCheckRow
					feature={t`Ранний доступ к новым функциям`}
					freeHas={false}
					premiumHas={true}
					premiumColumnRoundBottom
				/>
			</div>
		</div>
	);
});
