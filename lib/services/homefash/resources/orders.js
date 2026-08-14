'use strict';

var client = require('../client');

/**
 * Эндпоинты Homefash, относящиеся к заказам.
 *
 * Каждый новый раздел API — отдельный файл рядом с этим: транспорт,
 * авторизация и логирование при этом не трогаются.
 */

/**
 * POST /api/orders — отправка заказа.
 *
 * @param {object} payload  — готовый payload, см. mappers/orderPayload.js
 * @param {object} [options] — прокидывается в client.request
 */
exports.create = function (payload, options) {
  return client.request('POST', '/api/orders', payload, options);
};
