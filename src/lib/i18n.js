// Hand-coded i18n — no library. A plain nested dictionary + a couple helpers.
// SSR-safe: the active language is passed per-request via cookie -> layout data
// -> Svelte context (see +layout.svelte). No module-level mutable state.
//
// Content is the real copy from pi-retail.com (RU verbatim, EN translated).

export const LANGS = /** @type {const} */ (['ru', 'en']);
export const DEFAULT_LANG = 'ru';
export const EMAIL = 'hello@pi-retail.com';

/** @param {string | undefined | null} value */
export function normalizeLang(value) {
	return LANGS.includes(/** @type {any} */ (value)) ? value : DEFAULT_LANG;
}

export const dict = {
	ru: {
		meta: {
			title: 'PI Retail — быстрые победы для вашего бизнеса',
			description:
				'PI Retail — консалтинг и разработка ПО для повышения эффективности процессов в ритейле. 20+ лет опыта, 30+ проектов, измеримый результат «под ключ».'
		},
		nav: { about: 'О нас', services: 'Услуги', projects: 'Проекты', contact: 'Контакты', cta: 'Написать нам' },
		hero: {
			eyebrow: 'performance improvement retail',
			title: 'Быстрые победы для вашего бизнеса',
			subtitle:
				'Повышаем эффективность процессов в ритейле — от описания образа результата до внедрения «под ключ». Мы фанаты быстрых побед',
			ctaPrimary: 'Обсудить задачу',
			ctaSecondary: 'Наши услуги',
			stats: [
				{ value: '20+', label: 'лет релевантного опыта' },
				{ value: '30+', label: 'реализованных проектов' },
				{ value: '10+', label: 'ведущих консультантов' }
			]
		},
		about: {
			eyebrow: 'О нас',
			title: 'Кто мы',
			p1: 'PI Retail — компания, сфокусированная на консультационных услугах и разработке программного обеспечения по повышению эффективности процессов с подтверждением эффекта — от описания образа результата до внедрения «под ключ».',
			p2: '20+ лет релевантного опыта в 30+ проектах по повышению эффективности процессов в розничных операциях, финансах, логистике и ИТ позволяют нам предоставлять уникальные услуги и продукты для наших клиентов.',
			p3: 'Наш подход основан на понимании стратегической повестки заказчиков и на заранее известном наборе предварительных гипотез по улучшениям, что позволяет существенно сокращать время на диагностику «узких мест» и быстрее фокусироваться на практических решениях бизнес-задач. Мы фанаты быстрых побед, полученный эффект от которых наши заказчики реинвестируют в реализацию средне- и долгосрочных инициатив.',
			principlesTitle: 'Наши принципы',
			principles: [
				'Упрощённый проектный подход',
				'Ориентация на измеримый результат',
				'Индивидуальный подход к каждому проекту'
			],
			teamTitle: 'Команда',
			team: '10+ ведущих консультантов с опытом в топ-менеджменте и отраслевой экспертизой.',
			note: 'PI Retail (Performance Improvement Retail) — это направление консалтинга, ориентированное на повышение эффективности бизнеса в розничных сетях.'
		},
		services: {
			eyebrow: 'Услуги',
			title: 'Наши услуги',
			subtitle: 'Три направления, за каждым из которых стоит измеримый эффект',
			items: [
				{
					title: 'Развитие компании',
					points: [
						'Оценка уровня зрелости бизнеса',
						'Разработка целевой операционной модели в соответствии со стратегическими целями',
						'Разработка функциональных стратегий на 1–3 года',
						'Разработка антикризисных мер и контроль их исполнения',
						'Профили руководителей: KPI, роли, обязанности и ключевые ожидаемые результаты',
						'Применение OKR-методологии для достижения стратегических целей',
						'Создание и контроль исполнения проектной методологии'
					]
				},
				{
					title: 'Операционная эффективность',
					points: [
						'Упрощение бизнес-процессов для повышения уровня сервиса и фокуса на операциях, добавляющих ценность',
						'Проведение замеров производительности',
						'Нормирование операций',
						'Расчёт численности и графиков работы персонала',
						'Внедрение операционных стандартов',
						'Реализация систем контроля и отчётности'
					]
				},
				{
					title: 'IT',
					points: [
						'Выбор и интеграция технологических решений',
						'RFID-автоматизация процессов работы с товаром',
						'Настройка ИИ-помощников и чат-ботов',
						'Приложения для регистрации партнёров, чек-листов, фотоотчётов',
						'Единое решение вместо разрозненных инструментов коммуникации (почта, календари, звонки, задачи, база знаний, документы)'
					]
				}
			]
		},
		projects: {
			eyebrow: 'Проекты',
			title: 'Выборочные проекты и результаты',
			subtitle: 'Несколько кейсов и измеримый эффект',
			items: [
				{ tag: 'Fashion', title: 'ТОП-1 fashion-ритейлер РФ', body: 'Внедрение RFID-технологии', metric: 'Рост продаж +4,5%; рост OSA (представленность товара в нужной размерной сетке) на 12%' },
				{ tag: 'Fashion', title: 'ТОП-3 fashion-ритейлер РФ', body: 'Нормирование производительности и внедрение WFM-решения', metric: 'Рост производительности труда +13%; сокращение ФОТ −12%' },
				{ tag: 'Fashion', title: 'ТОП-3 fashion-ритейлер РФ', body: 'Внедрение DAM-системы (управление фотоактивами)', metric: 'Скорость производства +10%, надёжное хранение контента' },
				{ tag: 'Ювелирный', title: 'ТОП-2 ювелирный ритейлер РФ', body: 'Внедрение системы Visual AI на сайте компании', metric: 'Рост конверсии +10%' },
				{ tag: 'Ювелирный', title: 'ТОП-1 ювелирный ритейлер РФ', body: 'Обогащение клиентских данных', metric: 'Выручка на клиента +8%; затраты на маркетинг −15%; рост эффективности e-mail-канала' },
				{ tag: 'Fashion', title: 'ТОП-5 fashion-ритейлер РФ', body: 'Real-time ИИ-анализ трендов и конкурентов', metric: 'Качественные коммерческие возможности, снижение рисков новых коллекций, решения на основе покупательского интереса' },
				{ tag: 'Логистика', title: 'ТОП-10 fashion-ритейлер РФ', body: 'Переезд с арендованного склада на 3PL-провайдера с ИТ-интеграцией', metric: '98%+ OTIF (on time, in full) по всем каналам продаж' },
				{ tag: 'Логистика', title: 'ТОП-5 3PL-провайдер', body: 'Автоматизированная уборка складских помещений', metric: 'Внедрение роботов-уборщиков, окупаемость 1,5 года' },
				{ tag: 'Продукты', title: 'Премиум продуктовый ритейлер РФ', body: 'Разработка целевой организационной структуры', metric: 'Утверждённая оргструктура, сохраняющая уникальность ценностного предложения на основе стратегических целей' }
			]
		},
		contact: {
			eyebrow: 'Контакты',
			title: 'Напишите нам',
			subtitle: 'Расскажите о задаче — ответим в течение рабочего дня и предложим первый шаг',
			orEmail: 'или на почту',
			name: 'Имя',
			namePh: 'Как к вам обращаться',
			email: 'Email или телефон',
			emailPh: 'you@company.com',
			message: 'Сообщение',
			messagePh: 'Пара слов о задаче…',
			submit: 'Отправить',
			sending: 'Отправляем…',
			success: 'Спасибо! Мы получили заявку и скоро свяжемся.',
			error: 'Что-то пошло не так. Попробуйте ещё раз или напишите нам на почту.',
			required: 'Заполните обязательные поля.'
		},
		footer: { tagline: 'Быстрые победы для вашего бизнеса', rights: 'Все права защищены.' }
	},
	en: {
		meta: {
			title: 'PI Retail — fast wins for your business',
			description:
				'PI Retail — consulting and software development for process efficiency in retail. 20+ years of experience, 30+ projects, measurable turnkey results.'
		},
		nav: { about: 'About', services: 'Services', projects: 'Projects', contact: 'Contact', cta: 'Get in touch' },
		hero: {
			eyebrow: 'performance improvement retail',
			title: 'Fast wins for your business',
			subtitle:
				'We improve process efficiency in retail — from defining the target outcome to turnkey delivery. We’re fans of quick wins',
			ctaPrimary: 'Discuss your challenge',
			ctaSecondary: 'Our services',
			stats: [
				{ value: '20+', label: 'years of relevant experience' },
				{ value: '30+', label: 'projects delivered' },
				{ value: '10+', label: 'senior consultants' }
			]
		},
		about: {
			eyebrow: 'About',
			title: 'Who we are',
			p1: 'PI Retail is a company focused on consulting and software development for process efficiency — with proven impact, from defining the target outcome to turnkey implementation.',
			p2: '20+ years of relevant experience across 30+ efficiency projects in retail operations, finance, logistics and IT let us deliver unique services and products for our clients.',
			p3: 'Our approach is built on understanding the client’s strategic agenda and on a predefined set of improvement hypotheses — which drastically cuts the time spent diagnosing bottlenecks and gets us to practical solutions faster. We’re fans of quick wins, and the impact they generate is reinvested by our clients into mid- and long-term initiatives.',
			principlesTitle: 'Our principles',
			principles: [
				'A simplified project approach',
				'Focus on measurable results',
				'A tailored approach to every project'
			],
			teamTitle: 'Team',
			team: '10+ senior consultants with top-management experience and deep industry expertise.',
			note: 'PI Retail (Performance Improvement Retail) is a consulting practice focused on improving business efficiency in retail chains.'
		},
		services: {
			eyebrow: 'Services',
			title: 'Our services',
			subtitle: 'Three practice areas, each tied to measurable impact',
			items: [
				{
					title: 'Company development',
					points: [
						'Business maturity assessment',
						'Target operating model aligned with strategic goals',
						'Functional strategies for 1–3 years',
						'Anti-crisis measures and execution control',
						'Leadership profiles: KPIs, roles, responsibilities and key expected outcomes',
						'OKR methodology to achieve strategic goals',
						'Building and governing the project methodology'
					]
				},
				{
					title: 'Operational efficiency',
					points: [
						'Simplifying business processes to raise service levels and focus on value-adding operations',
						'Productivity measurement',
						'Operations time-standards (norming)',
						'Headcount and staff scheduling',
						'Rollout of operational standards',
						'Control and reporting systems'
					]
				},
				{
					title: 'IT',
					points: [
						'Selection and integration of technology solutions',
						'RFID automation of merchandise processes',
						'AI assistants and chatbots setup',
						'Apps for partner onboarding, checklists and photo reports',
						'A single platform to replace scattered communication tools (email, calendars, calls, task tracking, knowledge base, docs)'
					]
				}
			]
		},
		projects: {
			eyebrow: 'Projects',
			title: 'Selected projects and results',
			subtitle: 'A few cases and their measurable impact',
			items: [
				{ tag: 'Fashion', title: '#1 fashion retailer, Russia', body: 'RFID technology rollout', metric: 'Sales +4.5%; OSA (on-shelf availability in the right size range) +12%' },
				{ tag: 'Fashion', title: 'Top-3 fashion retailer, Russia', body: 'Productivity norming and WFM rollout', metric: 'Labor productivity +13%; payroll −12%' },
				{ tag: 'Fashion', title: 'Top-3 fashion retailer, Russia', body: 'DAM system rollout (photo-asset management)', metric: 'Production speed +10%, reliable content storage' },
				{ tag: 'Jewelry', title: 'Top-2 jewelry retailer, Russia', body: 'Visual AI system on the company website', metric: 'Conversion +10%' },
				{ tag: 'Jewelry', title: '#1 jewelry retailer, Russia', body: 'Customer data enrichment', metric: 'Revenue per customer +8%; marketing costs −15%; stronger e-mail channel' },
				{ tag: 'Fashion', title: 'Top-5 fashion retailer, Russia', body: 'Real-time AI analysis of trends and competitors', metric: 'Higher-quality commercial opportunities, lower risk on new collections, decisions driven by shopper interest' },
				{ tag: 'Logistics', title: 'Top-10 fashion retailer, Russia', body: 'Move from a leased warehouse to a 3PL provider with IT integration', metric: '98%+ OTIF (on time, in full) across all sales channels' },
				{ tag: 'Logistics', title: 'Top-5 3PL provider', body: 'Automated warehouse cleaning', metric: 'Cleaning robots deployed, 1.5-year payback' },
				{ tag: 'Grocery', title: 'Premium grocery retailer, Russia', body: 'Target organizational structure design', metric: 'Approved org structure preserving a unique value proposition based on strategic goals' }
			]
		},
		contact: {
			eyebrow: 'Contact',
			title: 'Get in touch',
			subtitle: 'Tell us about your challenge — we reply within one business day and propose a first step',
			orEmail: 'or email us at',
			name: 'Name',
			namePh: 'What should we call you',
			email: 'Email or phone',
			emailPh: 'you@company.com',
			message: 'Message',
			messagePh: 'A few words about the task…',
			submit: 'Send',
			sending: 'Sending…',
			success: 'Thanks! We got your request and will be in touch shortly.',
			error: 'Something went wrong. Please try again or email us directly.',
			required: 'Please fill in the required fields.'
		},
		footer: { tagline: 'Fast wins for your business', rights: 'All rights reserved.' }
	}
};
