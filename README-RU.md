# Сайт ООО «Спрингс Альянс»

Одностраничный B2B-сайт на Next.js 16, React 19, TypeScript и Tailwind CSS 4.

## Запуск

```bash
npm ci
npm run dev
```

Откройте `http://localhost:3000`. Production-сборка: `npm run build`, затем `npm start`.

Контакты и тексты находятся в `app/content.ts`. Данные перенесены с действующего сайта springs-alians.com. Переменные окружения — в `.env.example`. Форма отправляет письмо со вложениями через SMTP и опционально передаёт JSON в `CRM_WEBHOOK_URL`.

Фотографии продукции и лицензируемые иллюстративные кадры производства сохранены локально в `public/images`; авторы и источники перечислены в `SOURCES.md`.

Перед публикацией актуализируйте юридические документы и подтвердите действительность стандартов ISO.

## SMTP и Outlook Classic на REG.RU

Веб-сервер и почтовый сервис — независимые части. Если на REG.RU переносится только сайт, сохраните SMTP-параметры текущего почтового провайдера. На момент проверки MX-запись `springs-alians.ru` указывает на `mail.springs-alians.ru`.

Если почта тоже переносится на хостинг REG.RU, используйте параметры из `.env.example`:

- SMTP: `mail.hosting.reg.ru`, порт `465`, SSL/TLS;
- IMAP для Outlook Classic: `mail.hosting.reg.ru`, порт `993`, SSL/TLS;
- логин: полный адрес ящика, например `sale@springs-alians.ru`;
- SMTP-аутентификация обязательна, логин и пароль те же, что у ящика.

Пароль хранится только в файле `.env` на сервере и не коммитится в Git. После миграции почты замените MX/SPF/DKIM-записи на выданные REG.RU и не оставляйте MX двух провайдеров одновременно.

Скопируйте `.env.example` в `.env.local`, заполните `SMTP_PASSWORD` и проверьте авторизацию:

```bash
node --env-file=.env.local scripts/check-smtp.mjs
```

## CI/CD на сервер REG.RU

Схема рассчитана на VPS/облачный сервер REG.RU с Docker, Docker Compose и Nginx. GitHub Actions в `.github/workflows/ci-cd.yml`:

1. Для pull request и push в `main` запускает ESLint и production-сборку.
2. После успешной проверки `main` собирает Docker-образ и публикует его в GitHub Container Registry.
3. По SSH обновляет контейнер на REG.RU. Приложение слушает только `127.0.0.1:3000`; публичный HTTPS должен терминировать Nginx.

В GitHub добавьте Actions secrets:

- `REG_HOST`, `REG_SSH_PORT`, `REG_SSH_USER`, `REG_SSH_KEY`;
- `REG_DEPLOY_PATH`, например `/opt/springs-alliance`;
- `GHCR_USERNAME` и `GHCR_TOKEN` с правом `read:packages` для скачивания закрытого образа на сервер.

На сервере заранее создайте `$REG_DEPLOY_PATH/.env` по образцу `.env.example`, поставьте права `600` и заполните реальные SMTP-данные. Workflow не перезаписывает этот файл.

Пример reverse proxy находится в `deploy/nginx.conf.example`. Скопируйте его в `/etc/nginx/sites-available/springs-alliance`, включите сайт, проверьте `nginx -t` и выпустите TLS-сертификат. Лимит `client_max_body_size 25m` нужен для заявок с файлами до 20 МБ.
