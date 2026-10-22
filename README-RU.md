# Сайт ООО «Спрингс Альянс»

Одностраничный B2B-сайт на Next.js 16, React 19, TypeScript и Tailwind CSS 4. Production-сборка — статические HTML/CSS/JS и PHP-обработчик формы для REG.RU Host-A.

## Локальный запуск

```bash
npm ci
npm run dev
```

Откройте `http://localhost:3000`. Production-сборка:

```bash
npm run build
```

Готовый к загрузке на хостинг сайт появится в `out/`. Контакты и тексты находятся в `app/content.ts`, обработчик заявок — в `public/api/request.php`.

## Форма заявки и почта

Форма отправляет письмо средствами PHP-хостинга REG.RU:

- получатель: `sale@springs-alians.ru` — текущий Microsoft Exchange;
- отправитель: `site@springs-alians.com` — технический ящик на Host-A;
- `Reply-To`: email заказчика из формы;
- до 10 вложений общим размером до 20 МБ.

Пароль от текущего Exchange сайту не нужен. Почтовые DNS-записи домена `springs-alians.ru` менять нельзя.

Перед проверкой формы создайте в панели Host-A технический ящик `site@springs-alians.com`. Если у домена `.com` уже есть SPF-запись, её нужно дополнить механизмом REG.RU, а не создавать вторую SPF-запись.

## CI/CD для REG.RU Host-A

Workflow `.github/workflows/ci-cd.yml` проверяет код, собирает `out/`, проверяет PHP и после push в `main` загружает сайт на Host-A по SSH/rsync.

В GitHub нужно добавить Actions secrets:

- `REG_HOST` — имя сервера из раздела «Доступы»;
- `REG_SSH_PORT` — обычно `22`;
- `REG_SSH_USER` — основной логин хостинга вида `u1234567`;
- `REG_SSH_KEY` — приватный SSH-ключ для GitHub Actions;
- `REG_DEPLOY_PATH` — полный каталог сайта из ispmanager.

Workflow очищает устаревшие файлы только внутри `REG_DEPLOY_PATH` и не удаляет каталог `.well-known` для SSL.

## Первичная настройка Host-A

1. Войдите в ispmanager из личного кабинета REG.RU.
2. Добавьте `springs-alians.com` как WWW-домен и включите PHP FastCGI.
3. Узнайте полный корневой каталог сайта и сохраните его как `REG_DEPLOY_PATH`.
4. Добавьте публичный CI/CD SSH-ключ в `~/.ssh/authorized_keys`.
5. Создайте `site@springs-alians.com`.
6. Добавьте GitHub Actions secrets и запустите workflow.
7. Проверьте сайт на техническом адресе хостинга, форму и вложения.
8. Только после проверки измените A-записи `@` и `www` домена `.com`. MX/TXT/CNAME домена `.ru` оставьте без изменений.

Перед публикацией актуализируйте юридические документы и подтвердите действительность стандартов ISO.
