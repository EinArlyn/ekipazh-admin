'use strict';

/**
 * Конфигурация интеграции с Homefash IDS API.
 *
 * Всё читается из окружения, чтобы прод и тест отличались только .env.
 * Значения по умолчанию подобраны так, чтобы модуль был безопасен без
 * настройки: без переменных окружения он работает в режиме dryRun и никуда
 * не ходит.
 */

var DEFAULT_BASE_URL = 'https://homefash-ids-api.shw-komplett.de';

function toInt(value, fallback) {
  var parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

function toFloat(value, fallback) {
  var parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}

module.exports = {
  /** Базовый адрес API без завершающего слэша */
  baseUrl: (process.env.HOMEFASH_API_URL || DEFAULT_BASE_URL).replace(
    /\/+$/,
    '',
  ),

  /** Токен доступа, уходит в заголовке Api-Key */
  apiKey: process.env.HOMEFASH_API_KEY || '',
  apiKeyHeader: process.env.HOMEFASH_API_KEY_HEADER || 'Api-Key',

  /** Таймаут запроса, мс */
  timeout: toInt(process.env.HOMEFASH_TIMEOUT, 30000),

  /**
   * Режим "без отправки": payload собирается и логируется, POST не уходит.
   * Выключается ЯВНО: HOMEFASH_DRY_RUN=false.
   */
  dryRun: process.env.HOMEFASH_DRY_RUN !== 'false',

  /** Поставщик — это мы, в заказе он всегда один и тот же */
  supplier: {
    idNo: toInt(process.env.HOMEFASH_SUPPLIER_ID, null),
    name1: process.env.HOMEFASH_SUPPLIER_NAME || 'Ekipazh',
  },

  /**
   * Поле пользователя, в котором лежит номер клиента на стороне Homefash.
   * Отдельной колонки под интеграцию в БД нет, поэтому источник вынесен
   * в настройку — маппинг меняется без правки кода.
   */
  customerIdField: process.env.HOMEFASH_CUSTOMER_ID_FIELD || 'code_kb',

  /**
   * Номер клиента для тестовых отправок, когда в БД он не заполнен.
   * Держим в настройке, а не в коде: с зашитым номером боевой заказ уехал бы
   * под чужим идентификатором и никто бы этого не заметил.
   */
  fallbackCustomerId: process.env.HOMEFASH_FALLBACK_CUSTOMER_ID || '',

  /**
   * Логины (users.phone), которым доступна отправка. Пока это один дилер.
   */
  allowedLogins: (process.env.HOMEFASH_ALLOWED_LOGINS || 'dl_de7')
    .split(',')
    .map(function (login) {
      return login.trim().toLowerCase();
    })
    .filter(Boolean),

  /** Страна клиента: в users её нет, берём из настройки */
  defaultCountry: process.env.HOMEFASH_DEFAULT_COUNTRY || 'Deutschland',

  /**
   * Делить ли цены на orders.currency_value. Цены заказа хранятся в валюте
   * расчёта, партнёру нужны евро. Выключается явно: HOMEFASH_CONVERT_CURRENCY=false.
   */
  convertCurrency: process.env.HOMEFASH_CONVERT_CURRENCY !== 'false',

  /**
   * Процент, который вычитается из offerPrice как НДС. netPrice приходит из
   * БД уже без налога, а offerPrice — с ним. 0 — не вычитать.
   *
   * 15.97 — это доля налога в сумме с НДС (19 / 119), а не сама ставка.
   */
  offerVatRate: toFloat(process.env.HOMEFASH_OFFER_VAT_RATE, 15.97),

  /** Префикс номера предложения, например '[TEST] ' для тестовых отправок */
  offerPrefix: process.env.HOMEFASH_OFFER_PREFIX || '',
};
