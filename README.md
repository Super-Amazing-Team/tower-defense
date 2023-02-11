### Перед началом работы

1. Убедитесь что у вас установлен `node`, `pnpm` и `docker`
2. Выполните команду `pnpm -v` - если команда возвращает номер, то pnpm у Вас установлен.
3. Выполните команду `pnpm bootstrap` - это обязательный шаг, без него ничего работать не будет :)

### Запуск проекта в режиме разработки

- Выполните команду `pnpm dev` чтобы запустить и фронтенд и бекенд в режиме разработки
- Выполните команду `pnpm dev --scope=client` чтобы запустить только клиент
- Выполните команду `pnpm dev --scope=server` чтобы запустить только server

### Как добавить зависимости?

В этом проекте используется `monorepo` на основе [`lerna`](https://github.com/lerna/lerna)

Чтобы добавить зависимость для клиента
`pnpm --filter client i {your_dep}`

Для сервера
`pnpm --filter server i {your_dep}`

И для клиента и для сервера
`yarn lerna add {your_dep}`

Если вы хотите добавить dev зависимость, проделайте то же самое, но с флагом `dev`
для фронтенда:
`pnpm --filter client i -D {your_dep}`
для бекенда:
`pnpm --filter server i -D {your_dep}`

### Тесты

Для клиента используется [`react-testing-library`](https://testing-library.com/docs/react-testing-library/intro/)

`pnpm test`

### Линтинг

`pnpm lint`

### Форматирование prettier

`pnpm format`

### Production build

`pnpm build`

И чтобы посмотреть что получилось

`pnpm preview --scope client`
`pnpm preview --scope server`

## Хуки

В проекте используется [lefthook](https://github.com/evilmartians/lefthook)
Если очень-очень нужно пропустить проверки, используйте `--no-verify` (но не злоупотребляйте :)

## Ой, ничего не работает :(

Откройте issue, я приду :)

## Автодеплой статики на vercel

Зарегистрируйте аккаунт на [vercel](https://vercel.com/)
Следуйте [инструкции](https://vitejs.dev/guide/static-deploy.html#vercel-for-git)
В качестве `root directory` укажите `packages/client`

Все ваши PR будут автоматически деплоиться на vercel. URL вам предоставит деплоящий бот

## Production окружение в докере

Перед первым запуском выполните `node init.mjs`

`docker compose up` - запустит три сервиса

1. nginx, раздающий клиентскую статику (client)
2. node, ваш сервер (server)
3. postgres, вашу базу данных (postgres)

Если вам понадобится только один сервис, просто уточните какой в команде
`docker compose up {sevice_name}`, например `docker compose up server`

## Netlify deploy

Посмотреть как выглядит приложение можно [здесь](https://startling-bienenstitch-c29e13.netlify.app/).
