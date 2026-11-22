# @service/shop

`sellgar.shop.service` - сервис магазинов и каналов продаж. Он отделен от `sellgar.store.service`, потому что один catalog product может продаваться в разных магазинах с разными ценами, остатками и публикацией.

## Граница

- Product service владеет catalog product/variant/property/image.
- Store service владеет sellable product/variant, ценой, остатками и резервами.
- Shop service владеет магазинами/каналами, юридическими реквизитами, публичными контактами,
  адресами.

## Правила

- Не добавлять сюда product/store/cart/order логику.
- Схема изменяется только TypeORM migrations; `synchronize` всегда выключен.
- Изменение aggregate и запись integration event выполняются в одной транзакции через outbox.
- Writer, claim, порядок версий, relay/retry/timeout и метрики принадлежат общему
  @sellgar/outbox в code/library/sellgar.outbox.library. yarn build сначала собирает пакет;
  локальные копии инфраструктуры не создавать.
- Магазин сам является продавцом. Не вводить отдельный seller aggregate без нового требования
  marketplace или независимого управления несколькими магазинами одним юридическим лицом.
- Валюта принадлежит ценам и коммерческим предложениям Store. Не добавлять валюту по умолчанию в Shop.
- Shop-owned collections заменяются одной versioned-командой `shop.update`; отдельный публичный
  CRUD для контактов и адресов не вводится.
- Способы оплаты принадлежат Store/checkout/payment-конфигурации и не хранятся в Shop.
- Домены витрины, способы доставки и документы не входят в модель Shop. Их владельцы и жизненный
  цикл должны проектироваться отдельно при появлении соответствующей задачи.
- HTTP endpoints остаются в admin gateway, сервис принимает RMQ-команды из README.
- Не смешивать shop со складом. Если появится многоскладской учет, проектировать отдельную warehouse/inventory границу.

## Проверка

Из `code/`:

```bash
yarn --version
yarn migration:show
yarn build
yarn test --runInBand
```

## Deployment

- Структура `code/`, root `Dockerfile`, `.github/`, `helm/values.app.yaml`,
  `helm/dev/values.yaml`, `helm/prod/values.yaml`; общий chart находится в infrastructure.
- Рабочая ветка development; release/* → master с ручным продвижением того же digest.
- Доменные операции остаются RMQ. Внутренний `/health` на PORT (default 8080)
  проверяет PostgreSQL и подключение command consumer. Внешний Ingress запрещён.
- Глобальные pipe/filter наследуются RMQ listener через inheritAppConfig.
- Миграции выполняются отдельной Kubernetes Job до Deployment. Конфигурация без секретов монтируется
  как `/app/.env`; credentials берутся из Kubernetes Secrets.
- CI recursive checkout получает outbox submodule. Runtime image содержит его
  package.json и dist, чтобы production workspace dependency разрешалась штатно.

## Контракт CI/CD

- Отдельный Docker target `tests` и job `unit` обязательны; сборка и деплой зависят от успешных юнит-тестов.
- Есть отдельный `migration` image и job `migrate`; unit запускается до build, migrate — после publish.
- CI/CD и конфигурация описаны в разделе «CI и доставка» README. Python/smoke wrappers удалены; команды Helm/kubectl видны в общих workflows.

- Самостоятельные списки используют @sellgar/pagination: limit/nextToken, ответ items/meta, без totalRows и COUNT всей выборки. HMAC-ключ приходит только из Secret. Подробности — README. Вложенные коллекции и снимки не пагинировать.
