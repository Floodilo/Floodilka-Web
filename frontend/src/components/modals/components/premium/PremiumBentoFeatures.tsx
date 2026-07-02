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

import {Trans} from '@lingui/react/macro';
import {
	Bell,
	DotsThreeCircle,
	Image,
	IdentificationCard,
	Microphone,
	Sparkle,
	UserCircle,
	UsersThree,
	VideoCamera,
} from '@phosphor-icons/react';
import React from 'react';
import styles from './PremiumBentoFeatures.module.css';

const HoverSparkleIcon = ({children, alwaysSparkle = false}: {children: React.ReactNode; alwaysSparkle?: boolean}) => {
	return (
		<span className={`${styles.hoverIconStack} ${alwaysSparkle ? styles.hoverIconStackAlways : ''}`} aria-hidden>
			<span className={styles.hoverIconBase}>{children}</span>
			<Sparkle className={styles.hoverSparkleMain} />
			<Sparkle className={styles.hoverSparkleA} />
			<Sparkle className={styles.hoverSparkleB} />
		</span>
	);
};

export const PremiumBentoFeatures = ({fullWidth = false}: {fullWidth?: boolean}) => {
	return (
		<section className={`${styles.section} ${fullWidth ? styles.sectionFullWidth : ''}`} aria-labelledby="premium-bento-heading">
			<h2 id="premium-bento-heading" className={styles.sectionHeading}>
				<Trans>Почему стоит купить премиум</Trans>
			</h2>
			<ul className={styles.list}>
				<li className={styles.listItem}>
					<div className={styles.card}>
						<div className={styles.iconWrap}>
							<HoverSparkleIcon>
								<UsersThree className={styles.icon} />
							</HoverSparkleIcon>
						</div>
						<div className={styles.cardBody}>
							<h3 className={styles.title}>
								<Trans>Профили в каждом сообществе</Trans>
							</h3>
							<p className={styles.description}>
								<Trans>
									Создавайте уникальный профиль для каждого сервера: разные ники, аватары и оформление
								</Trans>
							</p>
						</div>
					</div>
				</li>

				<li className={styles.listItem}>
					<div className={styles.card}>
						<div className={styles.iconWrap}>
							<HoverSparkleIcon alwaysSparkle>
								<Microphone weight="fill" className={styles.icon} />
							</HoverSparkleIcon>
						</div>
						<div className={styles.cardBody}>
							<h3 className={styles.title}>
								<Trans>Значок профиля</Trans>
							</h3>
							<p className={styles.description}>
								<Trans>Эксклюзивный значок рядом с ником, который выделит ваш профиль среди участников</Trans>
							</p>
						</div>
					</div>
				</li>

				<li className={styles.listItem}>
					<div className={styles.card}>
						<div className={styles.iconWrap}>
							<HoverSparkleIcon>
								<VideoCamera className={styles.icon} />
							</HoverSparkleIcon>
						</div>
						<div className={styles.cardBody}>
							<h3 className={styles.title}>
								<Trans>Пользовательские видеофоны</Trans>
							</h3>
							<p className={styles.description}>
								<Trans>Используйте динамичные видеофоны для оформления своего профиля</Trans>
							</p>
						</div>
					</div>
				</li>

				<li className={styles.listItem}>
					<div className={styles.card}>
						<div className={styles.iconWrap}>
							<HoverSparkleIcon>
								<UserCircle className={styles.icon} />
							</HoverSparkleIcon>
						</div>
						<div className={styles.cardBody}>
							<h3 className={styles.title}>
								<Trans>Анимированные аватары</Trans>
							</h3>
							<p className={styles.description}>
								<Trans>Используйте GIF-аватарки и анимированные изображения для своего профиля</Trans>
							</p>
						</div>
					</div>
				</li>

				<li className={styles.listItem}>
					<div className={styles.card}>
						<div className={styles.iconWrap}>
							<HoverSparkleIcon>
								<Image className={styles.icon} />
							</HoverSparkleIcon>
						</div>
						<div className={styles.cardBody}>
							<h3 className={styles.title}>
								<Trans>Баннеры в профиле</Trans>
							</h3>
							<p className={styles.description}>
								<Trans>Украшайте профиль уникальными баннерами и создавайте собственный стиль</Trans>
							</p>
						</div>
					</div>
				</li>

				<li className={styles.listItem}>
					<div className={styles.card}>
						<div className={styles.iconWrap}>
							<HoverSparkleIcon>
								<IdentificationCard className={styles.icon} />
							</HoverSparkleIcon>
						</div>
						<div className={styles.cardBody}>
							<h3 className={styles.title}>
								<Trans>Анимированная карточка профиля</Trans>
							</h3>
							<p className={styles.description}>
								<Trans>
									Анимированный фон профиля в списке участников, делающий вас заметнее среди других пользователей
								</Trans>
							</p>
						</div>
					</div>
				</li>

				<li className={styles.listItem}>
					<div className={styles.card}>
						<div className={styles.iconWrap}>
							<HoverSparkleIcon>
								<Bell className={styles.icon} />
							</HoverSparkleIcon>
						</div>
						<div className={styles.cardBody}>
							<h3 className={styles.title}>
								<Trans>Пользовательские звуки уведомлений</Trans>
							</h3>
							<p className={styles.description}>
								<Trans>Установите собственные звуки для уведомлений и голосовых каналов</Trans>
							</p>
						</div>
					</div>
				</li>

				<li className={styles.listItem}>
					<div className={styles.card}>
						<div className={styles.iconWrap}>
							<HoverSparkleIcon>
								<DotsThreeCircle className={styles.icon} />
							</HoverSparkleIcon>
						</div>
						<div className={styles.cardBody}>
							<h3 className={styles.title}>
								<Trans>И многое другое</Trans>
							</h3>
							<p className={styles.description}>
								<Trans>
									Эксклюзивные функции, расширенная кастомизация и ранний доступ к новым возможностям
								</Trans>
							</p>
						</div>
					</div>
				</li>
			</ul>
		</section>
	);
};
