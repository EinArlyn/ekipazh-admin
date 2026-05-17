# ekipazh-admin

Серверная часть административной панели Ekipazh. REST-подобное приложение на Express.js с серверным рендерингом шаблонов Pug и PostgreSQL в качестве базы данных.

## Стек

| Компонент | Технология |
|---|---|
| Runtime | Node.js 22 |
| Фреймворк | Express 4 |
| ORM | Sequelize 3 + pg 8 |
| База данных | PostgreSQL |
| Шаблонизатор | Pug 3 |
| Процесс-менеджер | PM2 |
| Линтер / Форматтер | ESLint 8 + Prettier 3 |

---

## Локальная разработка

### Требования

- Node.js >= 22 (рекомендуется через [nvm](https://github.com/nvm-sh/nvm))
- Доступ к PostgreSQL-базе данных

### Установка

```bash
# Установить нужную версию Node.js
nvm use

# Установить зависимости
npm ci
```

### Настройка окружения

Скопируйте `.env.example` в `.env` и заполните значения:

```bash
cp .env.example .env
```

Описание переменных — в разделе [Переменные окружения](#переменные-окружения) ниже.

### Запуск

```bash
npm start
```

Приложение будет доступно по адресу [http://localhost:3000](http://localhost:3000).

---

## npm скрипты

| Команда | Описание |
|---|---|
| `npm start` | Запуск приложения (`node app.js`) |
| `npm run lint:js` | ESLint для JS-файлов |
| `npm run lint:pug` | pug-lint для шаблонов |
| `npm run lint` | Оба линтера сразу |
| `npm run lint:fix` | Автоисправление ESLint |
| `npm run format` | Форматирование через Prettier |

---

## Переменные окружения

Все переменные задаются в файле `.env` (локально) или через GitHub Secrets / Variables (CI/CD).

### База данных

| Переменная | Тип | Описание |
|---|---|---|
| `DB_HOST` | Variable | Хост PostgreSQL-сервера |
| `DB_USER` | Variable | Имя пользователя БД |
| `DB_PASSWORD` | **Secret** | Пароль пользователя БД |
| `DB_NAME` | Variable | Имя базы данных |
| `DB_PORT` | Variable | Порт PostgreSQL (по умолчанию `5432`) |

### Почта

| Переменная | Тип | Описание |
|---|---|---|
| `MAILER_USER` | Variable | Email-адрес отправителя |
| `MAILER_PASSWORD` | **Secret** | Пароль почтового аккаунта |
| `MAILER_HOST` | Variable | SMTP-хост |
| `MAILER_SSL` | Variable | Использовать SSL (`true` / `false`) |
| `MAIL_FROM` | Variable | Отображаемое имя и адрес отправителя (например, `App <noreply@example.com>`) |

### Ссылки приложения

| Переменная | Тип | Описание |
|---|---|---|
| `SPEC_LINK` | Variable | Базовый URL для генерации PDF-спецификаций |
| `CALCULATOR_LINK` | Variable | URL калькулятора |
| `ORDER_EXPORT_LINK` | Variable | URL экспорта заказов в 1С |
| `EXPORT_ORDER_HZ_LINK` | Variable | URL синхронизации печати в 1С |
| `ANALYTICS_URL` | Variable | URL аналитики (postlogin) |
| `ACTIVATION_URL` | Variable | Базовый URL для ссылок активации аккаунта |
| `PRO_URL` | Variable | URL сервиса обновлений PRO |
| `DOCUMENTS_URL` | Variable | URL синхронизации документов |
| `STATISTIC_LINK` | Variable | URL статистики (может быть пустым) |

### Сервер

| Переменная | Тип | Описание |
|---|---|---|
| `PORT` | Variable | Порт приложения (по умолчанию `3000`) |
| `SESSION_SECRET` | **Secret** | Секрет для подписи сессий — длинная случайная строка |
| `NODE_ENV` | — | `development` локально, `production` задаётся в CI/CD |

---

## CI/CD

Деплой запускается автоматически при пуше в ветку `main` через GitHub Actions (`.github/workflows/main.yml`).

### Этапы

```
push → main
  └─ lint        проверка ESLint
       └─ deploy  (только если lint прошёл)
            ├─ генерация .env из Secrets и Variables
            ├─ загрузка файлов на сервер по FTP
            └─ npm ci --omit=dev + pm2 start/restart по SSH
```

### Secrets (Settings → Secrets and variables → Actions → Secrets)

| Имя | Описание |
|---|---|
| `FTP_SERVER` | Хост FTP-сервера |
| `FTP_USERNAME` | Логин FTP |
| `FTP_PASSWORD` | Пароль FTP |
| `SSH_HOST` | Хост SSH-сервера |
| `SSH_USERNAME` | Логин SSH |
| `SSH_PASSWORD` | Пароль SSH |
| `DB_PASSWORD` | Пароль БД (продакшн) |
| `MAILER_PASSWORD` | Пароль почты (продакшн) |
| `SESSION_SECRET` | Секрет сессий (продакшн) |

### Variables (Settings → Secrets and variables → Actions → Variables)

| Имя | Пример значения |
|---|---|
| `PM2_APP_NAME` | `ekipazh-admin` |
| `DB_HOST` | `db.example.com` |
| `DB_USER` | `app_user` |
| `DB_NAME` | `ekipazh` |
| `DB_PORT` | `5432` |
| `MAILER_USER` | `noreply@example.com` |
| `MAILER_HOST` | `smtp.example.com` |
| `MAILER_SSL` | `false` |
| `MAIL_FROM` | `App <noreply@example.com>` |
| `SPEC_LINK` | `https://admin.example.com/orders/get-order-pdf/` |
| `CALCULATOR_LINK` | `https://calc.example.com` |
| `ORDER_EXPORT_LINK` | `https://export.example.com/1c_export/stekofs.php?order_id=` |
| `EXPORT_ORDER_HZ_LINK` | `https://export.example.com/1c_export/synhron/print/` |
| `ANALYTICS_URL` | `https://analytics.example.com/postlogin.php` |
| `ACTIVATION_URL` | `https://admin.example.com/services/account/activate?k=` |
| `PRO_URL` | `https://update.example.com` |
| `DOCUMENTS_URL` | `https://app.example.com/sync_calc` |
| `STATISTIC_LINK` | _(пусто)_ |
| `PORT` | `3000` |
