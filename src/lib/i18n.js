// Hand-coded i18n — no library. A plain nested dictionary + a couple helpers.
// SSR-safe: the active language is passed per-request via cookie -> layout data
// -> Svelte context (see +layout.svelte). No module-level mutable state.
//
// Content is the real copy from pi-retail.com (RU verbatim, EN translated).

export const LANGS = /** @type {const} */ (['ru', 'en']);
export const DEFAULT_LANG = 'ru';
// Temporarily Russian-only: hides the language toggle and pins SSR to ru.
// Flip to true to bring English back — dictionary and plumbing stay intact.
export const EN_ENABLED = false;
export const EMAIL = 'hello@pi-retail.com';

/** @param {string | undefined | null} value */
export function normalizeLang(value) {
	return LANGS.includes(/** @type {any} */ (value)) ? value : DEFAULT_LANG;
}

export const dict = {
	ru: {
		meta: {
			title: 'pi-retail | Быстрые победы для вашего бизнеса',
			description:
				'pi-retail — консалтинг и разработка ПО для повышения эффективности процессов в ритейле. 20+ лет опыта, 30+ проектов, измеримый результат «под ключ».'
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
			p1: 'pi-retail - компания, сфокусированная на консультационных услугах и разработке программного обеспечения по повышению эффективности процессов с подтверждением эффекта от описания образа результата до внедрения "под ключ".',
			p2: '20+ лет релевантного опыта в 30+ проектах по повышению эффективности процессов в розничных операциях, финансах, логистике и ИТ позволяют нам предоставлять уникальные услуги и продукты для наших клиентов.',
			p3: 'Наш подход основан на понимании стратегической повестки заказчиков, на заранее известном наборе предварительных гипотез по улучшениям, что позволяет существенно сокращать время на диагностику "узких мест" и быстрее фокусироваться на практических решениях бизнес-задач. Мы фанаты быстрых побед, полученный эффект от которых наши заказчики реинвестируют в реализацию средне- и долго-срочных инициатив.',
			principlesTitle: 'Наши принципы',
			principles: [
				'Упрощенный проектный подход',
				'Ориентация на измеримый результат',
				'Индивидуальный подход к каждому проекту'
			],
			teamTitle: 'Команда',
			team: '10+ ведущих консультантов с опытом в топ-менеджменте и отраслевой экспертизой.',
			note: 'pi retail - performance improvement retail (повышение эффективности в розничных сетях)'
		},
		services: {
			eyebrow: 'Услуги',
			title: 'Наши услуги',
			subtitle: '',
			items: [
				{
					title: 'Развитие компании',
					points: [
						'Оценка уровня зрелости бизнеса',
						'Разработка целевой операционной модели компании в соответствии со стратегическими целями компании',
						'Разработка функциональных стратегий на 1-3 года',
						'Разработка антикризисных мер и контроль их исполнения',
						'Разработка профилей руководителей с предложением KPIs, ролей, обязанностей и ключевых ожидаемых результатов от должности',
						'Применение OKR-методологиии для выполнения стратегических целей компании',
						'Создание и контроль исполнения проектной методологии'
					]
				},
				{
					title: 'Операционная эффективность',
					points: [
						'Упрощение бизнес-процессов для повышения уровня сервиса и фокуса на операциях, добавляющих ценность',
						'Проведение замеров производительности',
						'Нормирование операций',
						'Расчет численности и графиков работы персонала',
						'Внедрение операционных стандартов',
						'Реализация систем контроля и отчетности'
					]
				},
				{
					title: 'IT',
					points: [
						'Выбор и интеграция технологических решений',
						'RFID-автоматизация процессов работы с товаром',
						'Настройка ИИ-помощников, Чат-ботов',
						'Приложений для регистрации партнеров, проведения чек-листов, фотоотчетов',
						'Внедрение единого решения для отказа от разрозненных инструментов коммуникации (эл.почта, календари, онлайн-звонки, отслеживание задач, база знаний, совместная работа с документами)'
					]
				}
			]
		},
		projects: {
			eyebrow: 'Проекты',
			title: 'Выборочные проекты и результаты',
			subtitle: '',
			items: [
				{ tag: 'Fashion', title: 'ТОП-1 Fashion розничная сеть РФ', body: 'Внедрение RFID-технологии', metric: 'Рост продаж 4,5%; Рост OSA (представленность товара в торговом зале в необходимой размерной сетке) на 12%' },
				{ tag: 'Fashion', title: 'ТОП-3 Fashion розничная сеть РФ', body: 'Нормирование производительности и внедрение WFM решения', metric: 'Рост производительности труда на 13%; Сокращение ФОТ на 12%' },
				{ tag: 'Fashion', title: 'ТОП-3 Fashion розничная сеть РФ', body: 'Внедрение DAM системы (управление фото активами)', metric: 'Повышение скорости производства (10+%) и надежности хранения контента' },
				{ tag: 'Ювелирный', title: 'ТОП-2 ювелирная розничная сеть РФ', body: 'Внедрение системы Visual AI на web-сайте компании', metric: 'Рост конверсии 10+%' },
				{ tag: 'Ювелирный', title: 'ТОП-1 ювелирная розничная сеть РФ', body: 'Обогащение клиентских данных', metric: '8+% Рост выручки на клиента; Снижение затрат на маркетинг 15+%; Рост эффективности e-mail канала' },
				{ tag: 'Fashion', title: 'ТОП-5 fashion розничная сеть РФ', body: 'Внедрение real time ИИ-анализа трендов и конкурентов', metric: 'Определение качественных коммерческих возможностей, снижение рисков при создании новых коллекций и принятие решений на основе покупательского интереса' },
				{ tag: 'Логистика', title: 'ТОП-10 fashion розничная сеть РФ', body: 'Организация переезда с арендованного склада на 3PL провайдера с необходимой ИТ-интеграцией', metric: '98+% OTIF (on time, in full) для всех каналов продаж' },
				{ tag: 'Логистика', title: 'ТОП-5 Third Party Logistics провайдер', body: 'Автоматизированная уборка складских помещений', metric: 'Внедрение роботов-уборщиков, окупаемость 1,5 года' },
				{ tag: 'Продукты', title: 'Премиум продуктовая розничная сеть РФ', body: 'Разработка целевой организационной структуры', metric: 'Утвержденная организационная структура для сохранения уникальности ценностного предложения клиентам, основанного на стратегических целях компании' }
			]
		},
		contact: {
			eyebrow: 'Контакты',
			title: 'Напишите нам',
			subtitle: 'Расскажите о задаче — ответим в течение рабочего дня и предложим первый шаг',
			orEmail: 'на почту',
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
			errorExpired: 'Страница была открыта слишком давно. Отправьте форму ещё раз.',
			errorRate: 'Слишком много попыток. Подождите немного и попробуйте снова.',
			required: 'Заполните обязательные поля.'
		},
		footer: { tagline: 'Быстрые победы для вашего бизнеса', rights: 'Все права защищены.' }
	},
	en: {
		meta: {
			title: 'pi-retail — fast wins for your business',
			description:
				'pi-retail — consulting and software development for process efficiency in retail. 20+ years of experience, 30+ projects, measurable turnkey results.'
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
			p1: 'pi-retail is a company focused on consulting and software development for process efficiency — with proven impact, from defining the target outcome to turnkey implementation.',
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
			note: 'pi retail - performance improvement retail (improving efficiency in retail chains)'
		},
		services: {
			eyebrow: 'Services',
			title: 'Our services',
			subtitle: '',
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
			subtitle: '',
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
			orEmail: 'email us at',
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
			errorExpired: 'This page was open for too long. Please submit the form again.',
			errorRate: 'Too many attempts. Please wait a bit and try again.',
			required: 'Please fill in the required fields.'
		},
		footer: { tagline: 'Fast wins for your business', rights: 'All rights reserved.' }
	}
};
