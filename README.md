# Сайт ООО «Спрингс Альянс»

Одностраничный B2B-сайт на Next.js 16, React 19, TypeScript и Tailwind CSS 4.

## Локальный запуск

```bash
pnpm install
pnpm dev
```

Откройте `http://localhost:3000`. Production-сборка: `pnpm build`, затем `pnpm start`.

## Настройка

- Контакты и изменяемые тексты: `app/content.ts`.
- Переменные окружения: скопируйте `.env.example` в `.env.local`.
- Форма отправляет данные в `app/api/request/route.ts`. Сейчас обработчик валидирует запрос и умеет передавать JSON в `CRM_WEBHOOK_URL`. Перед production-запуском подключите хранение файлов и SMTP/CRM по требованиям вашей инфраструктуры.
- Значения «32 единицы» и «0,3–7,0 мм» отмечены как требующие подтверждения заказчиком.

## Аналитика

Рекомендуемые события: `hero_view`, `drawing_cta_click`, `engineer_cta_click`, `form_start`, `form_step`, `file_upload`, `form_success`, `form_error`, `phone_click`, `email_click`, `faq_open`, `scroll_25`, `scroll_50`, `scroll_75`, `scroll_90`.

## Перед публикацией

Замените временные контакты и домен, добавьте утверждённые реквизиты, политику обработки данных, реальные фотографии и подтверждённые сертификаты. Проверьте интеграцию CRM/SMTP и максимальный размер файлов на уровне прокси/хостинга.
