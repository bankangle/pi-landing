// Hand-coded i18n — no library. A plain nested dictionary + a couple helpers.
// SSR-safe: the active language is passed per-request via cookie -> layout data
// -> Svelte context (see +layout.svelte). No module-level mutable state.

export const LANGS = /** @type {const} */ (['ru', 'en']);
export const DEFAULT_LANG = 'ru';

/** @param {string | undefined | null} value */
export function normalizeLang(value) {
	return LANGS.includes(/** @type {any} */ (value)) ? value : DEFAULT_LANG;
}

export const dict = {
	ru: {
		meta: {
			title: 'PI Retail — быстрые победы для вашего бизнеса',
			description:
				'PI Retail помогает ритейлу расти: аналитика, автоматизация и быстрые точечные решения, которые приносят результат уже в этом квартале.'
		},
		nav: { about: 'О нас', services: 'Услуги', projects: 'Проекты', contact: 'Контакты', cta: 'Обсудить проект' },
		hero: {
			eyebrow: 'Ритейл-консалтинг и разработка',
			title: 'Быстрые победы для вашего бизнеса',
			subtitle:
				'Мы находим точки роста в ритейле и превращаем их в измеримый результат — без долгих внедрений и раздутых бюджетов.',
			ctaPrimary: 'Обсудить проект',
			ctaSecondary: 'Наши услуги',
			stat1: 'проектов запущено',
			stat2: 'средний рост выручки',
			stat3: 'до первого результата'
		},
		about: {
			eyebrow: 'О нас',
			title: 'Небольшая команда с фокусом на результат',
			body: 'PI Retail — это команда практиков ритейла и инженеров. Мы не продаём «трансформацию на два года»: мы находим конкретные узкие места, чиним их и показываем цифры. Каждый спринт — измеримая победа.',
			point1Title: 'Практический опыт',
			point1Body: 'Работали внутри розничных сетей — знаем боль изнутри.',
			point2Title: 'Скорость',
			point2Body: 'Первые результаты за недели, а не за кварталы.',
			point3Title: 'Прозрачность',
			point3Body: 'Понятные метрики и отчётность на каждом этапе.'
		},
		services: {
			eyebrow: 'Услуги',
			title: 'Что мы делаем',
			subtitle: 'Точечные решения, которые быстро окупаются.',
			items: [
				{ title: 'Аналитика и данные', body: 'Дашборды, прогнозирование спроса, ценообразование и управление запасами на основе данных.' },
				{ title: 'Автоматизация процессов', body: 'Убираем ручную рутину в закупках, логистике и отчётности — освобождаем команду.' },
				{ title: 'E-commerce и интеграции', body: 'Связываем кассы, склады, маркетплейсы и CRM в единый работающий контур.' },
				{ title: 'Быстрые аудиты', body: 'За 2 недели находим точки роста и даём план действий с приоритетами.' }
			]
		},
		projects: {
			eyebrow: 'Проекты',
			title: 'Результаты, а не презентации',
			subtitle: 'Несколько примеров того, что приносит «быстрая победа».',
			items: [
				{ tag: 'Аналитика', title: 'Управление запасами', body: 'Снизили неликвиды и out-of-stock у сети магазинов.', metric: '-23% замороженных запасов' },
				{ tag: 'Автоматизация', title: 'Автозаказ поставщикам', body: 'Автоматизировали формирование заказов по 40+ поставщикам.', metric: '12 часов/нед сэкономлено' },
				{ tag: 'E-commerce', title: 'Синхронизация каналов', body: 'Единые остатки и цены между офлайн и маркетплейсами.', metric: '+18% онлайн-выручки' }
			]
		},
		contact: {
			eyebrow: 'Контакты',
			title: 'Расскажите о вашей задаче',
			subtitle: 'Ответим в течение рабочего дня и предложим первый шаг.',
			name: 'Имя',
			namePh: 'Как к вам обращаться',
			email: 'Email или телефон',
			emailPh: 'you@company.com',
			message: 'Сообщение',
			messagePh: 'Пара слов о задаче…',
			submit: 'Отправить',
			sending: 'Отправляем…',
			success: 'Спасибо! Мы получили заявку и скоро свяжемся.',
			error: 'Что-то пошло не так. Попробуйте ещё раз или напишите нам напрямую.',
			required: 'Заполните обязательные поля.'
		},
		footer: { tagline: 'Быстрые победы для вашего бизнеса', rights: 'Все права защищены.' }
	},
	en: {
		meta: {
			title: 'PI Retail — fast wins for your business',
			description:
				'PI Retail helps retailers grow: analytics, automation and quick, targeted solutions that deliver results this quarter.'
		},
		nav: { about: 'About', services: 'Services', projects: 'Projects', contact: 'Contact', cta: 'Start a project' },
		hero: {
			eyebrow: 'Retail consulting & engineering',
			title: 'Fast wins for your business',
			subtitle:
				'We find growth opportunities in retail and turn them into measurable results — without long rollouts or bloated budgets.',
			ctaPrimary: 'Start a project',
			ctaSecondary: 'Our services',
			stat1: 'projects launched',
			stat2: 'avg. revenue lift',
			stat3: 'to first result'
		},
		about: {
			eyebrow: 'About',
			title: 'A small team obsessed with results',
			body: 'PI Retail is a team of retail practitioners and engineers. We don’t sell two-year "transformations" — we find concrete bottlenecks, fix them, and show the numbers. Every sprint is a measurable win.',
			point1Title: 'Hands-on experience',
			point1Body: 'We’ve worked inside retail chains — we know the pain first-hand.',
			point2Title: 'Speed',
			point2Body: 'First results in weeks, not quarters.',
			point3Title: 'Transparency',
			point3Body: 'Clear metrics and reporting at every step.'
		},
		services: {
			eyebrow: 'Services',
			title: 'What we do',
			subtitle: 'Targeted solutions that pay off fast.',
			items: [
				{ title: 'Analytics & data', body: 'Dashboards, demand forecasting, pricing and data-driven inventory management.' },
				{ title: 'Process automation', body: 'We remove manual routine in purchasing, logistics and reporting — freeing your team.' },
				{ title: 'E-commerce & integrations', body: 'We connect POS, warehouses, marketplaces and CRM into one working loop.' },
				{ title: 'Rapid audits', body: 'In 2 weeks we find growth points and hand you a prioritized action plan.' }
			]
		},
		projects: {
			eyebrow: 'Projects',
			title: 'Results, not slide decks',
			subtitle: 'A few examples of what a "fast win" looks like.',
			items: [
				{ tag: 'Analytics', title: 'Inventory management', body: 'Cut dead stock and out-of-stock across a store chain.', metric: '-23% frozen inventory' },
				{ tag: 'Automation', title: 'Supplier auto-ordering', body: 'Automated order generation across 40+ suppliers.', metric: '12 hrs/week saved' },
				{ tag: 'E-commerce', title: 'Channel sync', body: 'Unified stock and pricing across offline and marketplaces.', metric: '+18% online revenue' }
			]
		},
		contact: {
			eyebrow: 'Contact',
			title: 'Tell us about your challenge',
			subtitle: 'We reply within one business day and propose a first step.',
			name: 'Name',
			namePh: 'What should we call you',
			email: 'Email or phone',
			emailPh: 'you@company.com',
			message: 'Message',
			messagePh: 'A few words about the task…',
			submit: 'Send',
			sending: 'Sending…',
			success: 'Thanks! We got your request and will be in touch shortly.',
			error: 'Something went wrong. Please try again or reach out to us directly.',
			required: 'Please fill in the required fields.'
		},
		footer: { tagline: 'Fast wins for your business', rights: 'All rights reserved.' }
	}
};
