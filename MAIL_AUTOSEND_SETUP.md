# Автоматическая отправка заявок через Яндекс Почту

## Что уже сделано в проекте
1. В `contacts.html` форма теперь сначала отправляет данные на API `POST /api/send-request`.
2. Если API недоступен, включается резервный сценарий: формирование `.eml` + ссылка для ручной отправки.
3. Добавлен backend-сервис `backend-mailer/` для отправки писем через `smtp.yandex.ru`.
4. Файл с чертежом/ТЗ необязательный: заявка отправляется и без вложения.

## Минимум, что нужно для автоотправки
1. Почтовый ящик в Яндексе (лучше отдельный служебный, например `contact@investstanok.ru`).
2. Доступ SMTP для этого ящика + пароль приложения.
3. Node.js сервер для `backend-mailer` (GitHub Pages это не запускает).
4. Домен/поддомен API и разрешенный `ALLOWED_ORIGINS`.
5. Прокси `/api/send-request` на backend или полный URL API в `data-mail-api` формы.

## Файлы backend
- `backend-mailer/server.js`
- `backend-mailer/package.json`
- `backend-mailer/.env.example`

## Подключение Яндекс Почты
1. Создайте/используйте почтовый ящик, от имени которого будут уходить заявки, например:
   - `contact@investstanok.ru`
2. Включите SMTP в Яндекс 360 / Яндекс Почте для домена.
3. Создайте пароль приложения для SMTP (если включена 2FA).

## Настройка окружения
1. Перейдите в `backend-mailer`:
   - `cd backend-mailer`
2. Установите зависимости:
   - `npm install`
3. Создайте `.env` на основе примера:
   - `cp .env.example .env`
4. Заполните `.env`:
   - `PORT=8787`
   - `TARGET_EMAIL=contact@investstanok.ru`
   - `YANDEX_SMTP_USER=contact@investstanok.ru`
   - `YANDEX_SMTP_PASS=<пароль SMTP/пароль приложения>`
   - `ALLOWED_ORIGINS=https://bykhauskiivan-sudo.github.io,https://your-domain.ru`

## Запуск
- `npm start`

Проверка:
- `GET http://localhost:8787/api/health` -> `{ "ok": true, ... }`

## Как связать фронтенд и backend
На форме уже стоит:
- `data-mail-api="/api/send-request"`

Варианты:
1. Reverse proxy (рекомендуется):
   - фронт и API на одном домене, `/api/*` проксируется на backend.
2. Отдельный API-домен:
   - в `contacts.html` замените `data-mail-api="/api/send-request"` на полный URL:
   - `data-mail-api="https://api.your-domain.ru/api/send-request"`

## Важно про GitHub Pages
GitHub Pages не выполняет Node.js код, поэтому backend нужно размещать отдельно:
- VPS / Docker
- Render / Railway / Fly.io
- любой хостинг с Node.js

## Безопасность
1. Никогда не храните SMTP пароль в `HTML/JS`.
2. Храните SMTP логин/пароль только в `.env` на сервере.
3. Ограничивайте `ALLOWED_ORIGINS` только вашими доменами.
